import { getRandomCart } from '../../../../components/features/Modal/helpers'
import { createData } from '../../../../mongoDB/general'

export async function POST() {
   return Response.json(createData(getRandomCart()))
}
