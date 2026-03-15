import styled, { css } from 'styled-components'

export const CalendarWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`

export const MonthNav = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const MonthLabel = styled.h2`
  font-size: 20px;
  font-weight: 600;
  min-width: 200px;
  text-align: center;
`

export const NavButton = styled.button`
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
  transition: all 0.15s;

  &:hover {
    background: #f3f4f6;
    border-color: #9ca3af;
  }
`

export const TodayButton = styled(NavButton)`
  font-weight: 500;
`

export const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  width: 240px;
  outline: none;
  transition: border-color 0.15s;

  &:focus {
    border-color: #4a90d9;
    box-shadow: 0 0 0 2px rgba(74, 144, 217, 0.15);
  }
`

export const CountrySelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: #fff;
  cursor: pointer;
  outline: none;

  &:focus {
    border-color: #4a90d9;
  }
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  flex: 1;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
`

export const DayHeader = styled.div`
  padding: 8px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`

export const Cell = styled.div<{
  $isCurrentMonth: boolean
  $isToday: boolean
  $isDragOver: boolean
}>`
  min-height: 120px;
  padding: 4px;
  border-right: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: background 0.15s;

  &:nth-child(7n) {
    border-right: none;
  }

  ${(p) =>
    !p.$isCurrentMonth &&
    css`
      background: #f9fafb;
      color: #9ca3af;
    `}

  ${(p) =>
    p.$isToday &&
    css`
      background: #eff6ff;
    `}

  ${(p) =>
    p.$isDragOver &&
    css`
      background: #dbeafe;
    `}
`

export const DayNumber = styled.span<{ $isToday: boolean }>`
  font-size: 12px;
  font-weight: 500;
  padding: 2px 6px;
  margin-bottom: 2px;
  align-self: flex-end;

  ${(p) =>
    p.$isToday &&
    css`
      background: #4a90d9;
      color: #fff;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    `}
`

export const HolidayBadge = styled.div`
  font-size: 10px;
  color: #dc2626;
  padding: 1px 4px;
  background: #fef2f2;
  border-radius: 3px;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 0;
`

export const TaskList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
  min-height: 0;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
  }
`

export const TaskItemWrapper = styled.div<{
  $color: string
  $isDragging: boolean
  $dimmed: boolean
}>`
  font-size: 12px;
  padding: 3px 6px;
  border-radius: 4px;
  border-left: 3px solid ${(p) => p.$color};
  background: ${(p) => (p.$isDragging ? '#e0e7ff' : '#f8f9fa')};
  cursor: grab;
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: ${(p) => (p.$dimmed ? 0.3 : 1)};
  transition: opacity 0.15s, background 0.15s;

  &:hover {
    background: #e5e7eb;
  }

  &:active {
    cursor: grabbing;
  }
`

export const TaskTitle = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const TaskDeleteBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  font-size: 14px;
  line-height: 1;
  padding: 0 2px;
  opacity: 0;
  transition: opacity 0.15s, color 0.15s;

  ${TaskItemWrapper}:hover & {
    opacity: 1;
  }

  &:hover {
    color: #ef4444;
  }
`

export const InlineInput = styled.input`
  width: 100%;
  font-size: 12px;
  padding: 3px 6px;
  border: 1px solid #4a90d9;
  border-radius: 4px;
  outline: none;
  background: #fff;
`

export const AddTaskArea = styled.div`
  margin-top: auto;
  padding-top: 2px;
  cursor: pointer;
  font-size: 11px;
  color: #9ca3af;
  text-align: center;

  &:hover {
    color: #4a90d9;
  }
`

export const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  font-size: 14px;
  color: #6b7280;

  &::after {
    content: '';
    width: 24px;
    height: 24px;
    border: 3px solid #e5e7eb;
    border-top-color: #4a90d9;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`
