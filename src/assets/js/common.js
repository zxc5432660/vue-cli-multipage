
import ClipboardJS from 'clipboard'
import { Toast } from 'vant';
export function clipboard (params) {
  let {querySlector} = params
  return new Promise(resolve => {
    let clipboard = new ClipboardJS(querySlector, {
      text: (trigger) => {
        return trigger.getAttribute('copy-text')
    }})
    clipboard.on('success', e => {
     Toast("复制成功")
      e.clearSelection()
      resolve(e)
    })
    clipboard.on('error', e => {
      resolve(e)
    })
  })
}
 
 