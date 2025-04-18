export const Aside = () => {
  return (
    <aside className="w-full [grid-area:sidebar]">
      <div className="sticky top-0 h-screen rounded-md border border-gray-600/40 bg-white p-4">
        <h2 className="text-lg font-semibold">Aside</h2>
        <p className="mt-2 text-sm text-gray-600">This is the aside section.</p>
      </div>
    </aside>
  )
}
