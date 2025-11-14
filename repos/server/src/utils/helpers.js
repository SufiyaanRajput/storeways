import { customAlphabet } from 'nanoid/async';
import joiToSwagger from 'joi-to-swagger';

export const formatJoiData = (data) => {
  const {error: {details=[]} = {}} = data;
  let isInValid = false;
  const errors = details.reduce((errors, detail) => {
    if(detail.message){
      isInValid = true;
      errors[detail.context.label] = detail.message;
    }
    return errors;
  }, {});

  return {values: data.value, errors, isInValid};
}

export const formatFromError = (error) => {
  const {error: ignoreErrorObject, status = 500, msgText='Something went wrong!', data={}, ...rest} = error;
  return {status, success: false, message: msgText, ...data};
}

export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000);
}

export const customJoiValidators = {
  validateMobile: (value, helper) => {
    if(!/\+91[7-9][0-9]{9}$/.test(value)){
      return helper.message('Invalid mobile');
    }

    return value;
  }
}

export const validateOTPExpiry = (generatedAt) => {
  const expiryDateTime = new Date(generatedAt);
  expiryDateTime.setMinutes(expiryDateTime.getMinutes() + 5);
  const currentDateTime = new Date();

  if(currentDateTime > expiryDateTime){
    throw {
      status: 400, 
      msgText: 'Invalid OTP!', 
      error: new Error
    };
  }
}

export const makeRandomNanoId = async () => {
  const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 13);
  return nanoid();
}

export const getVariationGroupBySelection = (productVariationStocks, selectedVariationOptions) => {
  return productVariationStocks.filter(pvs => {
    return selectedVariationOptions.every(svo => {
      //todo: also include non groups variation
      return pvs.variationGroup.find(vg => vg.name === svo.variationName && vg.value === svo.option);
    })
  });
}

export const groupRelationsByName = ({ 
  source, 
  parentKeyTarget,   // e.g., 'productIds' or 'categoryIds'
  parentKey,         // e.g., 'productId' or 'categoryId'
  childKey,          // e.g., 'categoryId' or 'id'
  optionKey = 'option', 
  optionsKey = 'options' 
}) => {
  let result = source.reduce((target, item) => {
    if (!target[item.name]) {
      target[item.name] = { [parentKeyTarget]: [item[parentKey]], id: item[childKey] };
    } else {
      target[item.name][parentKeyTarget].push(item[parentKey]);
    }

    if (item[optionKey]) {
      if (!target[item.name].values) target[item.name].values = [];
      target[item.name].values.push(item[optionKey]);
    }

    if (item[optionsKey]) {
      target[item.name].options = item[optionsKey];
    }

    return target;
  }, {});

  result = Object.keys(result).map(key => ({ name: key, ...result[key] }));
  return result;
}

export const makeSwaggerFromJoi = ({ 
  JoiSchema, 
  route, 
  method, 
  summary, 
  tags, 
  security = true, 
  roles = ['owner'],
  contentType = 'application/json',
  formDataSchema = undefined
}) => {
  const { swagger } = joiToSwagger(JoiSchema);
  const operationObject = {
    summary,
    tags,
  };

  if (contentType === 'multipart/form-data') {
    operationObject.requestBody = {
      content: {
        'multipart/form-data': {
          schema: formDataSchema || { type: 'object' },
        },
      },
    };
  } else {
    operationObject.requestBody = {
      content: {
        'application/json': { schema: swagger },
      },
    };
  }

  if (security) {
    operationObject.security = [
      {
        bearerAuth: [], // 🔒 this line tells Swagger it needs a JWT
      },
    ];

    operationObject.description = `🔒 Requires JWT token. Accessible only by users with the "${roles.join(', ')}" role.`;
  }

  const swaggerSchema = {
    [route]: {
      [method]: operationObject,
    },
  };

  return swaggerSchema; 
}
