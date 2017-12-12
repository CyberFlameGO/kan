import tippy from 'tippy.js';
import $ from 'jquery';
import 'simpler-sidebar';
// import 'mathjax';


$(document).ready(() => {
    console.log('wat');


    $('body').append(`
      <div id="fuckingtemp" style="display: none;">
      ...
      </div>
    `)

    $('body').append(`
      <div id="toggle-sidebar">
        <svg version="1.1" width="100%" height="100%" viewBox='0 -1 180 198' xmlns='http://www.w3.org/2000/svg'>
          <path id="svg_logo_path" fill="rgba(0, 0, 0, 0.2)" d='
            M170,60c4,11-1,20-12,25c-9,4-25,3-20,15c5,5,15,0,24,1c11,1,21,11,14,21c-10,15-35,6-48-1c-5-3-27-23-32-10c-1,13,15,10,22,16
            c11,4,24,14,34,20c12,10,7,25-9,23c-11-1-22-9-30-16c-5-5-13-18-21-9c-2,6,2,11,5,14c9,9,22,14,22,31c-2,8-12,8-18,4c-4-3-9-8-11-13
            c-3-6-5-18-12-18c-14-1-5,28-18,30c-9,2-13-9-12-16c1-14,12-24,21-31c5-4,17-13,10-20c-9-10-19,12-23,16c-7,7-17,16-31,15
            c-9-1-18-9-11-17c5-7,14-4,23-6c6-1,15-8,8-15c-5-6-57,2-42-24c7-12,51,4,61,6c6,1,17,4,18-4c2-11-12-7-21-8c-21-2-49-14-49-34
            c0-5,3-11,8-11C31,42,34,65,42,67c6,1,9-3,8-9C49,49,38,40,40,25c1-5,4-15,13-14c10,2,11,18,13,29c1,8,0,24,7,28c15,0,5-22,4-30
            C74,23,78,7,87,1c8-4,14,1,16,9c2,11-8,21-2,30c8,2,11-6,14-12c9-14,36-18,30,5c-3,9-12,19-21,24c-6,4-22,10-23,19c-2,14,15,2,18-2
            c9-9,20-18,33-22C159,52,166,54,170,60' />
        </svg>
      </div>
    `)

    setTimeout(() => {

    window.$( ".rightHandSide" ).simplerSidebar( {
        selectors: {
            trigger: "#toggle-sidebar",
        }
    } );
  }, 0)


    setTimeout(() => {

    const template = document.getElementById('fuckingtemp')
    const initialText = template.textContent
    const tip = {
      loading: false
    }
    $('#Content a.existingWikiWord').each((idx, elem) => {
      if ($(elem).parents('.hide').length) {
        return;
      }
      tippy(elem,  {
        position: 'bottom',
        theme: 'light',
        interactive: true,
        arrow: true,
        html: '#fuckingtemp',
        onShow() {

          // `this` inside callbacks refers to the popper element
          const content = this.querySelector('.tippy-tooltip-content')
          if (tip.loading || content.innerHTML !== initialText) return

          tip.loading = true
          console.log('loading text')

          $.get(elem.href, htmlBody => {
            const parsedBody = $($.parseHTML(htmlBody))
            const fetchedDefn = getDefn(parsedBody);
            const defnElem = $('<div></div>').append(fetchedDefn);
            console.log('loaded defn', fetchedDefn)

            content.innerHTML = defnElem.html()
            tip.loading = false
          })

          // .catch(e => {
          //   console.log(e)
          //   content.innerHTML = 'Loading failed'
          //   tip.loading = false
          // })
        },
        onHidden() {
          const content = this.querySelector('.tippy-tooltip-content')
          content.innerHTML = initialText
        },
        // prevent tooltip from displaying over button
        popperOptions: {
          modifiers: {
            preventOverflow: {
              enabled: false
            },
            hide: {
              enabled: false
            }
          }
        }
      })
    })


}, 300)
})


const defnSelectors = [
  '#definition',
  '#definitions',
  '#idea',
  '#idea_and_definition',
  '#overview',
  '#scope',
  '#statement'
]

function getDefnSource() {

}

function truncateBody() {

}

function getDefn(parsedBody) {

  for (let i = 0; i < defnSelectors.length; i++) {
      const attempt = getDefnForSelector(parsedBody, defnSelectors[i]);
      if (attempt) { return attempt; }
  }

  return 'could not load definition'

}

function getDefnForSelector(parsedBody, selector) {
  const defnBody = parsedBody.find(selector).next('.num_defn')
  if (defnBody.length) {
    return defnBody;
  }
  const altResult = parsedBody.find(selector).nextUntil('h2').slice(0, 3)
  if (altResult.length) {
    return altResult;
  }
}