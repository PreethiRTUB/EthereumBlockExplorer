export default function (controller) {
  return async (context, next) => {
    const params = context.params
    const body = context.request.body
    const query = context.query
    context.status = 200
    context.type = 'json'
    try {
      const { data } = await controller(params, query, body, context)
      context.body = {
        data,
        success: true
      }
    } catch (e) {
      context.logger.error(e)
      context.body = {
        errorMessage: e,
        success: false
      }
    }
    await next
  }
}
