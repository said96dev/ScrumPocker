import * as Ably from 'ably'
import { useEffect, useCallback } from 'react'

const ably = new Ably.Realtime({ key: process.env.NEXT_PUBLIC_ABLY_API_KEY })

export function useChannel(
  channelName: string,
  callbackOnMessage: (msg: Ably.Message) => void
) {
  const channel = ably.channels.get(channelName)
  const onMount = useCallback(() => {
    channel.subscribe(callbackOnMessage)
  }, [channel, callbackOnMessage])

  const onUnmount = useCallback(() => {
    channel.unsubscribe(callbackOnMessage)
  }, [channel, callbackOnMessage])

  useEffect(() => {
    onMount()
    return () => {
      onUnmount()
    }
  }, [onMount, onUnmount])

  return channel
}

export function getAblyChannel(channelName: string) {
  return ably.channels.get(channelName)
}

export function publishToChannel(
  channelName: string,
  eventName: string,
  data: any
) {
  const channel = getAblyChannel(channelName)

  return channel.publish(eventName, data)
}
