import { formatJoiData } from '../../utils/helpers';

export default (schema) => (req, res, next) => {
  const { body, params, query } = req;
  const validations = schema.validate({ ...body, ...params, ...query}, { abortEarly: false });  
  const {values, errors, isInValid} = formatJoiData(validations);

  if (isInValid) {
    return res.status(400).send(errors);
  }

  req.values = values;
  next();
}