type API_USER =
   | 'user/create'
   | 'user/confirm'
   | 'user/login'
   | 'user/getOne'
   | 'user/update'
   | 'user/verify'
   | 'user/recoveryPassword'
   | 'user/attachGroup'
   | 'user/getList'
   | 'user/verification'
   | 'user/untieGroup'

type API_MATERIALS =
   | 'materials/create/subject'
   | 'materials/create/theme'
   | 'materials/edit/file'
   | 'materials/edit/subject'
   | 'materials/edit/theme'
   | 'materials/get/subjects'
   | 'materials/get/'
   | 'materials/get/md'
   | 'materials/delete/subject'
   | 'materials/delete/theme'

type API_SHOP = 'shop/buyCase'

type API_WORDLE = 'wordle/init' | 'wordle/ask' | 'wordle/info'

type API_GROUP =
   | 'group/getInfo'
   | 'group/getUsers'
   | 'group/create'
   | 'group/getList'
   | 'group/selectMains'
   | 'group/uploadFile'

export type ALL_API = API_USER | API_MATERIALS | API_SHOP | API_WORDLE | API_GROUP
