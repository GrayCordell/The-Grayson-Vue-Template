// useTouchDragDrop.js
import type { UnwrapRef } from 'vue'
import { onBeforeUnmount, ref } from 'vue'

export function useTouchDragDrop<T>(args?: {
  onDragStart?: (event: TouchEvent, startPosition: { x: number, y: number }, data: UnwrapRef<T>) => unknown
  onDragMove?: (event: TouchEvent, startPosition: { x: number, y: number }, data: UnwrapRef<T>) => unknown
  onDragEnd?: (event: TouchEvent, startPosition: { x: number, y: number }, data: UnwrapRef<T>) => unknown
}) {
  const onDragStart = args?.onDragStart
  const onDragMove = args?.onDragMove
  const onDragEnd = args?.onDragEnd

  let dragClone: HTMLElement | undefined | null
  let startPosition: { x: number, y: number } | undefined
  const transferData = ref<T | null>(null)

  const createDragImage = (element: HTMLElement) => {
    dragClone = element.cloneNode(true) as HTMLElement
    dragClone.style.position = 'absolute'
    dragClone.style.zIndex = '9999'
    dragClone.style.top = '-1000px' // Initially position it off-screen
    document.body.appendChild(dragClone)
  }

  const onTouchMove = (event: TouchEvent) => {
    const touch = event.touches[0]
    if (dragClone) {
      dragClone.style.left = `${touch.pageX - (dragClone.offsetWidth / 2)}px`
      dragClone.style.top = `${touch.pageY - (dragClone.offsetHeight / 2)}px`
    }

    if (typeof onDragMove === 'function' && startPosition && transferData.value)
      onDragMove(event, startPosition, transferData.value)
  }

  const onTouchEnd = (event: TouchEvent) => {
    if (dragClone) {
      document.body.removeChild(dragClone)
      dragClone = null
    }

    document.removeEventListener('touchmove', onTouchMove)
    document.removeEventListener('touchend', onTouchEnd)

    if (typeof onDragEnd === 'function' && startPosition && transferData.value)
      onDragEnd(event, startPosition, transferData.value)

    transferData.value = null // Clear the transfer data after the drop is complete
  }

  const onTouchStart = (event: TouchEvent, data: UnwrapRef<T | null> = null) => {
    event.preventDefault()
    const touch = event.touches[0]
    startPosition = { x: touch.pageX, y: touch.pageY }

    // Store the provided data for transfer
    transferData.value = data

    const element = event.currentTarget as HTMLElement
    if (!element)
      return

    createDragImage(element)
    if (!dragClone)
      return

    // Position the clone under the user's finger
    dragClone.style.left = `${touch.pageX - (element.offsetWidth / 2)}px`
    dragClone.style.top = `${touch.pageY - (element.offsetHeight / 2)}px`

    document.addEventListener('touchmove', onTouchMove)
    document.addEventListener('touchend', onTouchEnd)

    if (typeof onDragStart === 'function' && startPosition && transferData.value)
      onDragStart(event, startPosition, transferData.value)
  }

  // Clean up event listeners when component unmounts
  onBeforeUnmount(() => {
    if (dragClone)
      document.body.removeChild(dragClone)

    document.removeEventListener('touchmove', onTouchMove)
    document.removeEventListener('touchend', onTouchEnd)
  })

  return { onTouchStart, transferData }
}
