import OpenAI from 'openai'
import type { Quote, ServiceItem, CustomerInfo, QuoteCalculation } from '../types/quote'
import { generateId, getValidUntilDate } from './quoteCalculator'

const SYSTEM_PROMPT = `당신은 오피스버디(Office Buddie)의 세일즈 견적 전문가입니다.

오피스버디 서비스 정보:
- 기본 단가: 시간당 25,000원 (도급)
- 계산식: 일 투입시간 × 25,000 × 주 N회 × 4.34주 = 월 견적
- 컨시어지: 하프 250만원/월(주5회·4시간), 풀 400만원/월(주5회·8시간)
- VAT: 10% 별도

서비스 분류 체계:
공간 대분류: 공용공간, 사무공간, 건물공용부_내부, 건물공용부_외부
공간 소분류 예시: 미팅룸, 폰부스, 캔틴바, 라운지, 화장실, 사무공간, 엘리베이터/홀, 계단부, 테라스, 루프탑, 주차장
서비스 형태: 클리닝, 비품소모품 관리, 비상주
업무 주기: 매일, 주1회, 주2회, 주3회, 월2회, 월1회 등

사용자의 자연어 요청을 분석하여 다음 JSON 형식으로 견적 초안을 생성하세요.
고객 정보가 없는 필드는 빈 문자열로 두세요.
투입 시간과 방문 주기는 사무실 규모와 요청 내용을 바탕으로 합리적으로 추정하세요.

반드시 아래 JSON 형식만 출력하고, 다른 텍스트는 포함하지 마세요:
{
  "title": "견적서 제목 (예: 회사명_서비스명 견적서)",
  "customer": {
    "companyName": "고객사명",
    "contactName": "담당자명",
    "address": "주소",
    "officeSizePyeong": 0,
    "serviceFrequency": "주 N회 / 일 N시간",
    "obManager": "이선욱 대표이사"
  },
  "calculation": {
    "dailyHours": 0,
    "hourlyRate": 25000,
    "daysPerWeek": 0,
    "weeksPerMonth": 4.34,
    "monthlyAmount": 0,
    "vatAmount": 0,
    "totalAmount": 0
  },
  "serviceItems": [
    {
      "serviceType": "정기",
      "category": "클리닝",
      "spaceCategory": "공간 대분류",
      "spaceSubcategory": "공간 소분류",
      "taskName": "업무 내용",
      "frequency": "업무 주기",
      "notes": "비고"
    }
  ],
  "notes": "특이사항 및 추가 안내사항"
}`

export interface ParseResult {
  success: boolean
  quote?: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>
  error?: string
}

export async function parseNaturalLanguageToQuote(
  userInput: string,
  apiKey: string
): Promise<ParseResult> {
  const client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true })

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 4096,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `다음 요청사항을 바탕으로 오피스버디 견적서 초안을 JSON 형식으로 작성해주세요.\n\n요청사항:\n${userInput}`,
        },
      ],
      response_format: { type: 'json_object' },
    })

    const rawText = response.choices[0].message.content ?? ''
    const parsed = JSON.parse(rawText)
    const now = new Date().toISOString()

    const serviceItems: ServiceItem[] = (parsed.serviceItems || []).map(
      (item: Omit<ServiceItem, 'id'>) => ({ ...item, id: generateId() })
    )

    const { dailyHours, daysPerWeek, hourlyRate, weeksPerMonth } = parsed.calculation
    const monthlyAmount = Math.round(dailyHours * hourlyRate * daysPerWeek * weeksPerMonth)
    const vatAmount = Math.round(monthlyAmount * 0.1)

    const quote: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'> = {
      title: parsed.title || `${parsed.customer?.companyName || ''} 견적서`,
      customer: parsed.customer as CustomerInfo,
      calculation: {
        ...parsed.calculation,
        monthlyAmount,
        vatAmount,
        totalAmount: monthlyAmount + vatAmount,
      } as QuoteCalculation,
      serviceItems,
      addonServices: [],
      notes: parsed.notes || '',
      validUntil: getValidUntilDate(now),
    }

    return { success: true, quote }
  } catch (err) {
    const message = err instanceof Error ? err.message : '알 수 없는 오류'
    return { success: false, error: message }
  }
}
