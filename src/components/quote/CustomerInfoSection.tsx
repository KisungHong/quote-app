import type { CustomerInfo } from '../../types/quote'

interface Props {
  customer: CustomerInfo
  onChange: (updated: CustomerInfo) => void
}

const fields: { key: keyof CustomerInfo; label: string; placeholder: string; type?: string; span?: boolean }[] = [
  { key: 'companyName', label: '고객사명', placeholder: '주식회사 예시' },
  { key: 'contactName', label: '고객사 담당자', placeholder: '홍길동 이사님' },
  { key: 'address', label: '사무실 주소', placeholder: '서울특별시 강남구 테헤란로 ...', span: true },
  { key: 'officeSizePyeong', label: '실면적 (평)', placeholder: '150', type: 'number' },
  { key: 'serviceFrequency', label: '서비스 주기', placeholder: '주 5회 / 일 4시간' },
  { key: 'obManager', label: 'OB 담당자', placeholder: '이선욱 대표이사' },
]

export default function CustomerInfoSection({ customer, onChange }: Props) {
  const handleChange = (key: keyof CustomerInfo, value: string | number) => {
    onChange({ ...customer, [key]: value })
  }

  return (
    <div className="bg-white rounded-2xl border border-black/8 p-6 mb-3">
      <h2 className="text-[13px] font-semibold text-black mb-4 uppercase tracking-wide">고객사 정보</h2>
      <div className="grid grid-cols-2 gap-x-5 gap-y-3.5">
        {fields.map(({ key, label, placeholder, type, span }) => (
          <div key={key} className={span ? 'col-span-2' : ''}>
            <label className="block text-[11px] font-medium text-neutral-400 uppercase tracking-wide mb-1.5">{label}</label>
            <input
              type={type || 'text'}
              value={customer[key] ?? ''}
              onChange={(e) => handleChange(key, type === 'number' ? Number(e.target.value) : e.target.value)}
              placeholder={placeholder}
              className="w-full text-[14px] text-black border border-black/10 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/30 placeholder:text-neutral-300 transition-colors"
              style={{ fontFamily: 'inherit' }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
