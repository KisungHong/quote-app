import type { ServiceItem, ServiceCategory, ServiceType } from '../../types/quote'
import { generateId } from '../../lib/quoteCalculator'

interface Props {
  items: ServiceItem[]
  onChange: (items: ServiceItem[]) => void
}

const SERVICE_TYPES: ServiceType[] = ['정기', '비정기']
const CATEGORIES: ServiceCategory[] = ['클리닝', '비품소모품 관리', '비상주', '컨시어지']
const FREQUENCIES = ['매일', '주1회', '주2회', '주3회', '주5회', '월1회', '월2회', '수시']

const EMPTY_ITEM: Omit<ServiceItem, 'id'> = {
  serviceType: '정기',
  category: '클리닝',
  spaceCategory: '',
  spaceSubcategory: '',
  taskName: '',
  frequency: '매일',
  notes: '',
}

const inputCls = 'w-full border border-black/10 rounded-lg px-2 py-1.5 text-[12px] text-black focus:outline-none focus:ring-1 focus:ring-black/20 focus:border-black/30 placeholder:text-neutral-300 bg-white transition-colors'
const selectCls = 'border border-black/10 rounded-lg px-2 py-1.5 text-[12px] text-black focus:outline-none focus:ring-1 focus:ring-black/20 bg-white transition-colors w-full'

export default function ServiceItemsTable({ items, onChange }: Props) {
  const update = (id: string, field: keyof ServiceItem, value: string) => {
    onChange(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const addRow = () => onChange([...items, { ...EMPTY_ITEM, id: generateId() }])
  const removeRow = (id: string) => onChange(items.filter((item) => item.id !== id))

  return (
    <div className="bg-white rounded-2xl border border-black/8 p-6 mb-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[13px] font-semibold text-black uppercase tracking-wide">서비스 항목</h2>
        <button
          onClick={addRow}
          className="text-[12px] font-medium text-black border border-black/15 px-3 py-1.5 rounded-full hover:bg-black hover:text-white transition-colors"
        >
          + 항목 추가
        </button>
      </div>

      <div className="overflow-x-auto -mx-1">
        <table className="w-full" style={{ minWidth: 700 }}>
          <thead>
            <tr className="border-b border-black/6">
              {['정기/비정기', '서비스형태', '공간 대분류', '공간 소분류', '업무 내용', '업무 주기', '비고', ''].map((h) => (
                <th key={h} className="text-left text-[10px] font-semibold text-neutral-400 uppercase tracking-wider pb-2.5 pr-2 whitespace-nowrap px-1">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.id} className={`border-b border-black/4 ${idx % 2 === 0 ? '' : 'bg-neutral-50/50'}`}>
                <td className="py-1.5 pr-1.5 px-1">
                  <select value={item.serviceType} onChange={(e) => update(item.id, 'serviceType', e.target.value)} className={selectCls}>
                    {SERVICE_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </td>
                <td className="py-1.5 pr-1.5 px-1">
                  <select value={item.category} onChange={(e) => update(item.id, 'category', e.target.value)} className={selectCls}>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </td>
                <td className="py-1.5 pr-1.5 px-1" style={{ minWidth: 90 }}>
                  <input value={item.spaceCategory} onChange={(e) => update(item.id, 'spaceCategory', e.target.value)} placeholder="공용공간" className={inputCls} />
                </td>
                <td className="py-1.5 pr-1.5 px-1" style={{ minWidth: 90 }}>
                  <input value={item.spaceSubcategory} onChange={(e) => update(item.id, 'spaceSubcategory', e.target.value)} placeholder="미팅룸" className={inputCls} />
                </td>
                <td className="py-1.5 pr-1.5 px-1" style={{ minWidth: 130 }}>
                  <input value={item.taskName} onChange={(e) => update(item.id, 'taskName', e.target.value)} placeholder="바닥 클리닝" className={inputCls} />
                </td>
                <td className="py-1.5 pr-1.5 px-1">
                  <select value={item.frequency} onChange={(e) => update(item.id, 'frequency', e.target.value)} className={selectCls}>
                    {FREQUENCIES.map((f) => <option key={f}>{f}</option>)}
                  </select>
                </td>
                <td className="py-1.5 pr-1.5 px-1" style={{ minWidth: 110 }}>
                  <input value={item.notes} onChange={(e) => update(item.id, 'notes', e.target.value)} placeholder="비고" className={inputCls} />
                </td>
                <td className="py-1.5 px-1">
                  <button onClick={() => removeRow(item.id)} className="text-neutral-300 hover:text-red-400 transition-colors text-base leading-none">×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <div className="text-center py-10 text-neutral-300 text-[13px]">
            항목을 추가하거나 AI로 자동 생성하세요
          </div>
        )}
      </div>
    </div>
  )
}
