import { apiCall } from "./authServieces";

export const prepareFormData = ({
  templateName,
  isCategory,
  isLanguage,
  templateType,
  selectedMedia,
  fileType,
  fileURL,
  file,
  selectedVar,
  variableValue,
  templateMessage,
  footerVal,
  visitWebsiteText,
  domain,
  additionalUrls,
  phoneNumberText,
  phone,
  quickReply,
  isNewQuickReply,
  maxCharacters,
  charactersUsed,
  variables,
  inputFields,
  placeholderVariables
}) => {
  const formData = new FormData();
  // Append simple fields
  formData.append("templateName", templateName);
  formData.append("isCategory", isCategory);
  formData.append("isLanguage", isLanguage);
  formData.append("templateType", templateType);
  formData.append("selectedMedia", selectedMedia);
  formData.append("fileType", fileType);
  formData.append("fileURL", fileURL);
  formData.append("file", file);
  formData.append("selectedVar", selectedVar);
  formData.append("variableValue", variableValue);
  formData.append("templateMessage", templateMessage);
  formData.append("footerVal", footerVal);
  formData.append("maxCharacters", maxCharacters);
  formData.append("charactersUsed", charactersUsed);
  formData.append("visitWebsiteText", visitWebsiteText);
  formData.append("domain", domain);
  formData.append("newINputFiled", inputFields);
  formData.append("newPlaceHolderVariables", JSON.stringify(placeholderVariables));

  additionalUrls.forEach((url, index) => {
    formData.append(`newAddedUrlBtn${index}`, url.buttonText);
    formData.append(`newAddedUrlLink${index}`, url.domain)
  });

  // blank array for addition array
  let additionalUrlsArray = [];

  additionalUrlsArray.push({
    buttonText: visitWebsiteText,
    domain: domain
  });

  additionalUrls.forEach((url, index) => {
    additionalUrlsArray.push({
      buttonText: url.buttonText,
      domain: url.domain
    });
  });

  formData.append('additionUrlArray', JSON.stringify(additionalUrlsArray));
  

  formData.append('phoneNumberText', phoneNumberText);
  formData.append("phone", phone);
  // blank array for phone 
  let contactNumberArray = [];
  contactNumberArray.push({
    buttonText: phoneNumberText,
    phone: phone
  });

  formData.append('contactNumberArray', JSON.stringify(contactNumberArray))
  
  formData.append('quickReply', quickReply);
// blank array for quick reply
  let additionalQuickReply = [];
  additionalQuickReply.push({
    buttonText: quickReply
  })
  isNewQuickReply.forEach((reply, index)=>{
    additionalQuickReply.push({
      buttonText: reply.buttonText
    })
  })
  formData.append('additionalQuickReplyArray', JSON.stringify(additionalQuickReply));
  
  isNewQuickReply.forEach((reply, index) => {
    formData.append(`quickReplyText${index}`, reply.buttonText);
  });

  // Append variables
  const parsedVariables = typeof variables === "string" ? JSON.parse(variables) : variables;

  // blank array for variables
  let variableValues = [];


  Object.keys(parsedVariables).forEach((key) => {
    if (parsedVariables[key] !== '') {
      variableValues.push(parsedVariables[key]);
    }
  });

formData.append('placeholderArray', JSON.stringify(variableValues)); 
  // Find and append placeholders from templateMessage
  const regex = /{{(.*?)}}/g;
  const templateMessageMatches = Array.from(templateMessage.matchAll(regex));
  const lengths = templateMessageMatches.map((match) => match[0].length);

  formData.append("totalPlaceHolder", lengths.length);


  return formData;
};

// Post Template API
export const postTemplate = async ({ payload }) => {
  try {
    const response = await apiCall({
      endpoint: 'templates/addNewTemplate',
      method: 'POST',
      payload: payload
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// post media
export const postMedia = async({payload})=>{
  try{
    const response = await apiCall({
      endpoint: 'manage/uploadMedia',
      method: 'POST',
      payload: payload
    });
    return response;
  }catch(error){
    throw error;
  }
}

// Delete particular Template
export const deleteTemplate = async({payload}) =>{
  try{
    const response = await apiCall({
      endpoint: `templates/deleteTemplate/${payload}`,
      method: 'DELETE',
      payload: payload
    });
    return response;
  }catch(error){
    throw error;
  }
}
