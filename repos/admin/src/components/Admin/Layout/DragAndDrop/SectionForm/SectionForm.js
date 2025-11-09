import BannerCarouselForm from "./BannerCarouselForm";
import BlogForm from "./BlogForm";
import FeaturesForm from "./FeaturesForm";
import PostersForm from "./PostersForm";
import ProductsForm from "./ProductsForm";

const SectionForm = ({section, setSectionToEdit, refetchLayout}) => {
  const { id: sectionId } = section || {};

  switch(sectionId){
    case 'BANNER':
    case 'CAROUSEL':
     return(
     <BannerCarouselForm 
      setSectionToEdit={setSectionToEdit} 
      refetchLayout={refetchLayout}
      defaultValues={section.items}
      type={section} />
    );
    case 'POSTERS':
      return(
        <PostersForm type={section} refetchLayout={refetchLayout} setSectionToEdit={setSectionToEdit} />
      )
    case 'PRODUCTS':
      return(
        <ProductsForm type={section} refetchLayout={refetchLayout} setSectionToEdit={setSectionToEdit}/>
      )
    case 'FEATURES':
      return(
        <FeaturesForm type={section} refetchLayout={refetchLayout} setSectionToEdit={setSectionToEdit}/>
      )
    case 'BLOG':
      return(
        <BlogForm />
      )
    default:
      return null;
  } 
};

export default SectionForm;