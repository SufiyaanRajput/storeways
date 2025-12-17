import BannerCarouselForm from "./BannerCarouselForm";
import BlogForm from "./BlogForm";
import FeaturesForm from "./FeaturesForm";
import PostersForm from "./PostersForm";
import ProductsForm from "./ProductsForm";

const SectionForm = ({
  section,
  setSectionToEdit,
  refetchLayout,
  updateLayoutSection,
  uploadBannerImage,
  uploadPosterImage,
}) => {
  const { id: sectionId } = section || {};

  switch (sectionId) {
    case "BANNER":
    case "CAROUSEL":
      return (
        <BannerCarouselForm
          setSectionToEdit={setSectionToEdit}
          refetchLayout={refetchLayout}
          defaultValues={section.items}
          type={section}
          updateLayoutSection={updateLayoutSection}
          uploadBannerImage={uploadBannerImage}
        />
      );
    case "POSTERS":
      return (
        <PostersForm
          type={section}
          refetchLayout={refetchLayout}
          setSectionToEdit={setSectionToEdit}
          updateLayoutSection={updateLayoutSection}
          uploadPosterImage={uploadPosterImage}
        />
      );
    case "PRODUCTS":
      return (
        <ProductsForm
          type={section}
          refetchLayout={refetchLayout}
          setSectionToEdit={setSectionToEdit}
          updateLayoutSection={updateLayoutSection}
        />
      );
    case "FEATURES":
      return (
        <FeaturesForm
          type={section}
          refetchLayout={refetchLayout}
          setSectionToEdit={setSectionToEdit}
          updateLayoutSection={updateLayoutSection}
        />
      );
    case "BLOG":
      return <BlogForm />;
    default:
      return null;
  }
};

export default SectionForm;


