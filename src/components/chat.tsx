import '@styles/chat.css'

import { Input } from '@components/input'
import { MessagesComponent } from '@components/messages'

export const Chat = () => {
  return (
    <section className="chat h-full w-full justify-items-center gap-4 py-4 [grid-area:main]">
      <MessagesComponent />
      <Input />
    </section>
  )
}
