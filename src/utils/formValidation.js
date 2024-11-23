import * as Yup from 'yup';

  export const validationSchema = Yup.object().shape({
    templateName: Yup.string().required('Template name is required'),
    templateType: Yup.string().required('Template Type is not selected'),
    isLanguage: Yup.string().required('Language is not Selected'),
    // selectedMedia: Yup.string().required("You must select a media option").min(5, "You must select a media option"),
    templateMessage: Yup.string().required('Template Message is Required')
  });
  