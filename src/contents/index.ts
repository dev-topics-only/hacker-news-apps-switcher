import {
  $,
  $$,
  addEventListener,
  createElement,
  createSetStyle,
  setAttribute,
} from "browser-extension-utils"
import styleText from "data-text:./style.scss"

import { addValueChangeListener, getValue, setValue } from "../storage/index"

const apps = [
  "https://news.ycombinator.com/item?id=1234",
  "https://hn.svelte.dev/item/1234",
  // https://github.com/rocktimsaikia/hackernews-redesign
  "https://hn-redesign.vercel.app/items/1234",
  "https://insin.github.io/react-hn/#/story/1234",
  "https://lotusreader.netlify.app/item/1234",
  "https://hackernewsmobile.com/#/comments/1234",
  "https://hackerweb.app/#/item/1234",
  "https://hn.premii.com/#/comments/1234",
  "https://whnex.com/items/1234",
  "https://hack.ernews.info/comments-for/1234",
  "https://hacker-news.news/post/1234",
  "Close",
]

const setStyle = createSetStyle(styleText)

let tooltip = null
function toSiteName(url) {
  return /\/([^/]+)\//.exec(url)[1]
}

const handler = (event) => {
  let target = event.target
  const tooltip = $(".hnas_tooltip")
  if (tooltip) {
    while (target !== tooltip && target) {
      target = target.parentNode
    }

    if (target === tooltip) {
      event.preventDefault()
      return
    }

    tooltip.style.display = "none"
  }

  document.removeEventListener("click", handler)
}

function displayTooltip(id: string, wrapper) {
  if (!tooltip) {
    tooltip = createElement("div")
    setStyle(tooltip, ".hnas_wrapper > div.hnas_tooltip")
    setAttribute(tooltip, "class", "hnas_tooltip")

    const ul = createElement("ul")
    setStyle(ul, ".hnas_wrapper > div.hnas_tooltip > ul")
    for (const app of apps) {
      const li = createElement("li")
      setStyle(li, "display: block;")
      const link = createElement("a")
      setStyle(link, ".hnas_wrapper > div.hnas_tooltip > ul > li > a")
      link.isSwnaLink = true
      if (app === "Close") {
        link.innerHTML = "Close"
        setStyle(link, "color: #217dfc")
      } else {
        link.href = app
        setAttribute(link, "target", "_blank")
        link.innerHTML = toSiteName(app)
      }

      addEventListener(link, {
        click(event) {
          const tooltip = $(".hnas_tooltip")
          if (tooltip) {
            tooltip.style.display = "none"
          }

          document.removeEventListener("click", handler)
          if (link.innerHTML === "Close") {
            event.preventDefault()
          }
        },
        mouseover() {
          setStyle(
            link,
            "text-decoration: underline; background-color: #f3f4f6; color: black !important;"
          )
        },
        mouseout() {
          setStyle(link, "text-decoration: none; background-color: inherit;")
        },
      })

      li.append(link)
      ul.append(li)
    }

    tooltip.append(ul)
  }

  if (tooltip.style.display === "block" && tooltip.parentNode === wrapper) {
    return
  }

  for (const link of tooltip.querySelectorAll("ul li a")) {
    link.href = link.href.replace(/\d+/, id)
  }

  const linkElement = wrapper.previousSibling
  const width = linkElement.offsetWidth
  const height = linkElement.offsetHeight
  const top = linkElement.offsetTop
  const left = linkElement.offsetLeft
  wrapper.append(tooltip)
  tooltip.style.display = "block"
  tooltip.style.top = top + height + "px"
  tooltip.style.left = left + "px"
  tooltip.style.width = width + "px"

  document.removeEventListener("click", handler)
  setTimeout(() => {
    addEventListener(document, "click", handler)
  }, 100)
}

function updateLinks() {
  const links = $$(
    'a[href^="https://news.ycombinator.com/item?id="],a[href^="http://news.ycombinator.com/item?id="]'
  )
  for (const link of links) {
    if (link.binded || link.isSwnaLink) {
      continue
    }

    link.binded = true

    const wrapper = createElement("span")
    setAttribute(wrapper, "class", "hnas_wrapper")
    link.after(wrapper)

    const id = /id=(\d+)/.exec(link.href)[1]
    if (id) {
      addEventListener(link, "click", (event) => {
        event.preventDefault()
        displayTooltip(id, wrapper)
      })
    }
  }
}

function main() {
  if (!document.body) {
    return
  }

  setInterval(updateLinks, 1000)
  updateLinks()
}

main()
