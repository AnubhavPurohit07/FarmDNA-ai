export default function Card({ title, description, image, action }) {
  return (
    <div className="border border-gray-200 rounded p-4">
      {/* Optional Image */}
      {image && (
        <img src={image} alt={title} className="w-full h-40 object-cover mb-3" />
      )}

      {/* Title */}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-3">{description}</p>

      {/* Optional Action */}
      {action && (
        <button className="text-green-700 text-sm font-medium hover:underline">
          {action.label}
        </button>
      )}
    </div>
  )
}
