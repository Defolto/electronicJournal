import { useEffect } from 'react'
import { getCookie, setCookie } from '../../helpers/cookie'
import { createFetch } from '../../helpers/createFetch'
import { initGroups } from '../../store/groups/groupsSlice'
import { useAppDispatch } from '../../store/hooks'
import { initUser } from '../../store/user/userSlice'
import { IGroup, IUser } from '../../types'

export default function PreJoin() {
   const dispatch = useAppDispatch()

   useEffect(() => {
      dispatch(createFetch({ api: 'user/getOne' })).then(({ payload }) => {
         if (!payload) return

         const { user, groups } = payload as { user: IUser; groups: IGroup[] }
         dispatch(initUser(user as IUser))

         if (user.groups && groups) {
            const hasGroups = getCookie('groups_id')
            if (!hasGroups) {
               const groupsId = groups.map((group) => group.id)
               setCookie('groups_id', JSON.stringify(groupsId))
            }

            dispatch(initGroups(groups))
         }
      })
   }, [dispatch])

   useEffect(() => {
      ;(function (m, e, t, r, i, k, a) {
         // @ts-ignore
         m[i] =
            // @ts-ignore
            m[i] ||
            function () {
               // @ts-ignore
               ;(m[i].a = m[i].a || []).push(arguments)
            }
         // @ts-ignore
         m[i].l = 1 * new Date()
         for (var j = 0; j < document.scripts.length; j++) {
            if (document.scripts[j].src === r) {
               return
            }
         }
         // @ts-ignore
         ;(k = e.createElement(t)),
            // @ts-ignore
            (a = e.getElementsByTagName(t)[0]),
            // @ts-ignore
            (k.async = 1),
            // @ts-ignore
            (k.src = r),
            // @ts-ignore
            a.parentNode.insertBefore(k, a)
      })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym')

      // @ts-ignore
      ym(98271102, 'init', {
         clickmap: true,
         trackLinks: true,
         accurateTrackBounce: true,
         webvisor: true,
      })
   }, [])

   return null
}
