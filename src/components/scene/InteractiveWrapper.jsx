export default function InteractiveWrapper({
    id, name,
    selected, hovered,
    onClick, onPointerOver, onPointerOut,
    children
  }) {
    return (
      <group
        onClick={(e) => {
          e.stopPropagation()
          console.log(`${name || id} selected`)
          onClick()
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          console.log(`${name || id} hovered in`)
          onPointerOver()
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          console.log(`${name || id} hovered out`)
          onPointerOut()
        }}
      >
        {children}
      </group>
    )
  }
  