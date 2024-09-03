export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-full">
      <div
        className="inline-block w-8 h-8 border-4 border-solid border-white border-t-transparent rounded-full animate-spin"
        role="status"
      >
        <span className="sr-only"></span>
      </div>
    </div>
  )
}
