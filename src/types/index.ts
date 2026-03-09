export interface Task {
  _id: string
  title: string
  date: string
  order: number
  color: string
  createdAt: string
  updatedAt: string
}

export interface Holiday {
  date: string
  localName: string
  name: string
  countryCode: string
}

export interface DayCell {
  date: string
  dayNumber: number
  isCurrentMonth: boolean
  isToday: boolean
}
