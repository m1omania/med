#!/usr/bin/env node
/**
 * Проверка и исправление связок: Методы — Клиники — Врачи.
 * Правила:
 * 1. Если у метода есть doctorId, то clinicId метода должен совпадать с clinicId этого врача.
 * 2. Если у метода есть clinicId, то doctorId (если есть) должен быть врачом из этой клиники.
 * 3. Если у клиники один врач, у всех методов этой клиники должен быть проставлен этот doctorId
 *    (чтобы на странице врача отображались те же методы, что и у клиники).
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const publicDir = join(root, 'public', 'data')

const clinics = JSON.parse(readFileSync(join(publicDir, 'clinics.json'), 'utf-8')).clinics || []
const doctors = JSON.parse(readFileSync(join(publicDir, 'doctors.json'), 'utf-8')).doctors || []
const data = JSON.parse(readFileSync(join(publicDir, 'articles.json'), 'utf-8'))
let methods = [...(data.articles || [])]

const doctorById = Object.fromEntries(doctors.map((d) => [d.id, d]))
const doctorsByClinicId = {}
for (const d of doctors) {
  const cid = d.clinicId
  if (!doctorsByClinicId[cid]) doctorsByClinicId[cid] = []
  doctorsByClinicId[cid].push(d.id)
}

const clinicIds = new Set(clinics.map((c) => c.id))

function firstDoctorAtClinic(clinicId) {
  const ids = doctorsByClinicId[clinicId]
  return ids && ids.length ? ids[0] : null
}

const report = []
let fixed = 0

for (const m of methods) {
  const cid = m.clinicId
  const did = m.doctorId
  const slug = m.slug

  // 1) У метода есть doctorId — врач должен быть из клиники метода
  if (did != null) {
    const doc = doctorById[did]
    if (!doc) {
      report.push(`[${slug}] doctorId=${did} — врач не найден`)
      if (cid != null) {
        const newDid = firstDoctorAtClinic(cid)
        if (newDid != null) {
          m.doctorId = newDid
          fixed++
          report.push(`  → исправлено: doctorId=${newDid}`)
        } else delete m.doctorId
      } else delete m.doctorId
      continue
    }
    if (cid != null && doc.clinicId !== cid) {
      report.push(`[${slug}] clinicId=${cid}, doctorId=${did} — врач ${doc.name} привязан к клинике ${doc.clinicId}, не ${cid}`)
      const newDid = firstDoctorAtClinic(cid)
      if (newDid != null) {
        m.doctorId = newDid
        fixed++
        report.push(`  → исправлено: doctorId=${newDid}`)
      } else {
        delete m.doctorId
        fixed++
        report.push(`  → doctorId сброшен (в клинике ${cid} нет врачей в справочнике)`)
      }
    }
  }

  // 2) У метода есть clinicId, но нет doctorId — если в клинике ровно один врач, привязываем его
  if (cid != null && (m.doctorId == null)) {
    const ids = doctorsByClinicId[cid]
    if (ids && ids.length === 1) {
      m.doctorId = ids[0]
      fixed++
      report.push(`[${slug}] добавлен doctorId=${ids[0]} (единственный врач клиники ${cid})`)
    }
  }

  // 3) У метода есть doctorId, но нет clinicId — подставляем клинику врача
  if (did != null && (cid == null)) {
    const doc = doctorById[did]
    if (doc && doc.clinicId != null) {
      m.clinicId = doc.clinicId
      fixed++
      report.push(`[${slug}] добавлен clinicId=${doc.clinicId} по врачу`)
    }
  }
}

// Сводка: для каждой клиники — методы и врачи
report.push('')
report.push('--- Сводка по клиникам ---')
for (const c of clinics) {
  const cid = c.id
  const methodsAtClinic = methods.filter((m) => m.clinicId === cid)
  const doctorIdsAtClinic = doctorsByClinicId[cid] || []
  const methodsByDoctor = {}
  for (const did of doctorIdsAtClinic) {
    methodsByDoctor[did] = methods.filter((m) => m.doctorId === did)
  }
  report.push(`Клиника ${cid} (${c.name}): методов ${methodsAtClinic.length}, врачей ${doctorIdsAtClinic.length}`)
  for (const did of doctorIdsAtClinic) {
    const doc = doctorById[did]
    const list = methodsByDoctor[did] || []
    report.push(`  Врач ${did} (${doc?.name}): методов ${list.length}`)
  }
  if (doctorIdsAtClinic.length === 0 && methodsAtClinic.length > 0) {
    report.push('  (у клиники нет врачей в справочнике — методы без doctorId)')
  }
}

const out = report.join('\n')
console.log(out)

if (fixed > 0) {
  data.articles = methods
  writeFileSync(join(publicDir, 'articles.json'), JSON.stringify(data, null, 2))
  console.log(`\nИсправлено записей: ${fixed}. Файл articles.json обновлён.`)
}
