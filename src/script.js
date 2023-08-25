console.clear()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAAAAACN7WTCAAABFUlEQVR4AdXWR7kFIQwFYHZnHQExEQ+IiAAsoCE+IgMJo2IszPo1vtv7HfJ69v93Qif9qQL+DSQKQuafhiI/DXOOOURhUg0mlhJMrDWUl5JZQhQGJAB3AMOMwO4MAgbjmKQ1IQYwlMciOk0qwgQMOS02z1Z0RHaX1bwtS3PT3OXaQJbupvl1macuhYG1fW7c8rqVq7rFRkrZul5dFtm4p6mbRtvO9cy2afbOohGzSM5aqpl728dtZG+3uZvVojmLMBOAFfD1Pry4gOlWq5TS81HempwVq3FvOTCyAV5HNkB8y8U3efxYbWToIMevjvhlFb4eN2UWvMlrjQWm6KMD1RSrHIb5hz8PYPk3PyuiKPzTH90fqA/xJsnHZ8DX6wAAAABJRU5ErkJggg==')

/**
 * Particles
 */
// Geometry
const particlesGeometry = new THREE.BufferGeometry()
const count = 90000

const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

for(let i = 0; i < count * 3; i++)
{
    positions[i] = (Math.random() - 0.5) * 10
    colors[i] = Math.random()
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

// Material
const particlesMaterial = new THREE.PointsMaterial()

particlesMaterial.size = 0.08
particlesMaterial.sizeAttenuation = true

particlesMaterial.color = new THREE.Color('#ff88cc')

particlesMaterial.transparent = true
particlesMaterial.alphaMap = particleTexture
// particlesMaterial.alphaTest = 0.01
// particlesMaterial.depthTest = false
particlesMaterial.depthWrite = false
particlesMaterial.blending = THREE.AdditiveBlending

particlesMaterial.vertexColors = true

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 5
camera.position.y = -4
scene.add(camera)

// Controls
const controls = new THREE.OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

  
    // Update particles
    for(let i = 0; i < count; i++)    {
        let i3 = i * 3   
        const y = particlesGeometry.attributes.position.array[i3+1]
        particlesGeometry.attributes.position.array[i3+1 + 1] = Math.sin(elapsedTime + y)+Math.sin(elapsedTime + y*3)
    }
    particlesGeometry.attributes.position.needsUpdate = true

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()