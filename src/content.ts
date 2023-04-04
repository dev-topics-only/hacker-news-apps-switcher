import {
  addValueChangeListener,
  getValue,
  setValue,
} from "browser-extension-storage"
import {
  $,
  $$,
  addEventListener,
  createElement,
  createSetStyle,
  getAttribute,
  setAttribute,
} from "browser-extension-utils"
import styleText from "data-text:./content.scss"

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

let tooltip: HTMLElement = null
function toSiteName(url) {
  return /\/([^/]+)\//.exec(url)[1]
}

const handler = (event: MouseEvent) => {
  let target = event.target as HTMLElement
  const tooltip = $(".hnas_tooltip")
  if (tooltip) {
    while (target !== tooltip && target) {
      target = target.parentNode as HTMLElement
    }

    if (target === tooltip) {
      event.preventDefault()
      return
    }

    tooltip.style.display = "none"
  }

  document.removeEventListener("click", handler)
}

function displayTooltip(id: string, wrapper: HTMLElement) {
  if (!tooltip) {
    tooltip = createElement("div")
    setStyle(tooltip, ".hnas_wrapper > div.hnas_tooltip")
    setAttribute(tooltip, "class", "hnas_tooltip")

    const list = createElement("div")
    setStyle(list, ".hnas_wrapper > div.hnas_tooltip > div")
    for (const app of apps) {
      const link = createElement("a")
      setStyle(link, ".hnas_wrapper > div.hnas_tooltip > div > a")
      link.dataset.hnas_link = "1"
      if (app === "Close") {
        link.innerHTML = "Close"
        setStyle(link, "color: #217dfc; cursor: pointer;")
      } else {
        setAttribute(link, "href", app)
        setAttribute(link, "target", "_blank")
        link.innerHTML = toSiteName(app)
      }

      addEventListener(link, {
        click(event: MouseEvent) {
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
          if (app === "Close") {
            setStyle(link, "color: #217dfc; cursor: pointer;")
          }
        },
        mouseout() {
          setStyle(link, ".hnas_wrapper > div.hnas_tooltip > div > a", true)
          if (app === "Close") {
            setStyle(link, "color: #217dfc; cursor: pointer;")
          }
        },
      })

      list.append(link)
    }

    tooltip.append(list)
  }

  if (tooltip.style.display === "block" && tooltip.parentNode === wrapper) {
    return
  }

  for (const link of $$(tooltip, "div a")) {
    const href = getAttribute(link, "href")
    if (href) {
      setAttribute(link, "href", href.replace(/\d+/, id))
    }
  }

  const linkElement = wrapper.previousSibling as HTMLElement
  const width = linkElement.offsetWidth
  const height = linkElement.offsetHeight
  const top = linkElement.offsetTop
  const left = linkElement.offsetLeft
  wrapper.append(tooltip)
  setStyle(tooltip, {
    display: "block",
    top: String(top + height) + "px",
    left: String(left) + "px",
    width: String(width) + "px",
  })
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
    if (link.dataset.hnas_binded || link.dataset.hnas_link) {
      continue
    }

    link.dataset.hnas_binded = "1"

    const wrapper = createElement("span")
    setAttribute(wrapper, "class", "hnas_wrapper")
    link.after(wrapper)

    const id = /id=(\d+)/.exec(getAttribute(link, "href"))[1]
    if (id) {
      addEventListener(link, "click", (event: MouseEvent) => {
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
