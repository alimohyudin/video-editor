let height = 720
let width = 1280
let selectedElement = null
var container

function startCanvaEditor() {
  container = document.getElementById('canva__container')

  var box = document.getElementsByClassName('canva__box'),
    //captureBtn = document.getElementsByClassName('canva__capture')[0],
    //screenshotBtn = document.getElementsByClassName('video__screenshot')[0],
    body = document.getElementsByTagName('body')[0]
  //console.log(document.getElementsByClassName('canva__capture')[0])
  console.log(box)

  body.addEventListener('keydown', (e) => {
    console.log(e)
    switch (e.key) {
      case 'd':
        let newEl = selectedElement.cloneNode(true)
        container.appendChild(newEl)
        duplicateElement(newEl)
        break
      case 'g':
        console.log(selectedElement.children[0].classList)
        let glows = ['red', 'green', 'yellow', 'blue']
        let index = -1
        if (selectedElement.children[0].classList.length > 0) {
          let glow_classname = selectedElement.children[0].classList[0]
          selectedElement.children[0].classList.remove(glow_classname)
          glow_classname = glow_classname.replace('canva__component_', '').replace('_glow', '')
          index = glows.indexOf(glow_classname)
        }
        console.log(index)
        index = index >= glows.length ? -1 : index

        //console.log(selectedElement.children[0].classList[0])
        selectedElement.children[0].classList.add('canva__component_' + glows[index + 1] + '_glow')
        break

      case 'ArrowLeft':
        //console.log();

        let currentRotation = selectedElement.children[0].style.transform.replace('rotate(', '')
        currentRotation = currentRotation.replace('deg)', '')

        console.log(currentRotation)
        if (currentRotation == '' || isNaN(currentRotation)) currentRotation = 0
        const newRotation = `rotate(${parseInt(currentRotation) + 90}deg)`
        selectedElement.children[0].style.setProperty('transform', newRotation)
        break
      case 'ArrowRight':
        const newFlip = `scaleX(-1)`
        selectedElement.children[0].style.setProperty('transform', newFlip)
        break
      case '.':
        //increase height of selected element
        selectedElement.children[0].style.height = selectedElement.children[0].offsetHeight + 5
        break
      case ',':
        //decrease height of selected element
        selectedElement.children[0].style.height = selectedElement.children[0].offsetHeight - 5
        break
      case ']':
        //decrease height of selected element
        console.log(selectedElement.style.zIndex)
        selectedElement.style.setProperty('z-index', selectedElement.style.zIndex * 1 + 1)
        break
      case '[':
        //increase height of selected element
        console.log(selectedElement.style.zIndex)
        selectedElement.style.setProperty('z-index', selectedElement.style.zIndex * 1 - 1)
        break

      case '4':
        break
      case 'Delete':
        selectedElement.remove()
        break
      case '+':
        let plusKills = document.getElementById('numberOfKillsText').innerText
        document.getElementById('numberOfKillsText').innerText = plusKills * 1 + 1
        break
      case '-':
        let minusKills = document.getElementById('numberOfKillsText').innerText
        document.getElementById('numberOfKillsText').innerText = minusKills * 1 - 1
        break
      default:
        break
    }
  })
  /* box.forEach(el => ) */

  //screenshotBtn.addEventListener('click', shoot, false)
  /* Draggable.create(".draggable-box", {
      type: "x,y",
      edgeResistance: 0.65,
      bounds: "#draggable-container",
      inertia: true
  }); */
  console.log('running draggable')
  Draggable.create(box, {
    type: 'x,y',
    //trigger: "#draggable-container",
    bounds: container,
    inertia: true,
    autoScroll: true,

    onPress: function (e) {
      console.log('Pressed')
      console.log(e.target.parentElement)
      //e.target.style.setProperty("border", 'dashed 4px red')
      selectedElement = e.target.parentElement
    },
    onDrag: function () {
      console.log('onDrag')
    },
    onRelease: function (e) {
      //e.target.style.setProperty('border-style', 'none')
      //e.target.style.setProperty("border", 'dashed 4px transparent')
      e.preventDefault()
    }
  })
  let duplicateElement = function (el) {
    Draggable.create(el, {
      type: 'x,y',
      //trigger: "#draggable-container",
      //bounds: container,
      inertia: true,
      autoScroll: true,

      onPress: function (e) {
        console.log('Pressed')
        console.log(e.target.parentElement)
        selectedElement = e.target.parentElement
      },
      onDrag: function () {
        //console.log("onDrag")
      },
      onRelease: function (e) {
        e.preventDefault()
      }
    })
  }
}
