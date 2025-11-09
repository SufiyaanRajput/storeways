import { privateInstance } from "../../../../utils/api.config";

export const fetchLayout = ({page}) => privateInstance.get(`/v1/admin/customize/layout/${page}`);
export const updateLayout = ({page, ...payload}) => privateInstance.put(`/v1/admin/customize/layout/${page}`, payload);
export const updateLayoutSection = ({page, sectionId, ...payload}) => privateInstance.put(`/v1/admin/customize/layout/${page}/sections/${sectionId}`, {...payload});
export const uploadBannerImage = (form) => privateInstance.post(`/v1/admin/uploads/banner`, form);
export const deleteBannerImage = ({fileId}) => privateInstance.delete(`/v1/admin/uploads/banner/${fileId}`);
export const uploadPosterImage = (form) => privateInstance.post(`/v1/admin/uploads/poster`, form);
export const deletePosterImage = ({fileId}) => privateInstance.delete(`/v1/admin/uploads/poster/${fileId}`);
export const updateFooter = (payload) => privateInstance.put('/v1/admin/customize/footer', payload);
export const uploadFooterLogoImage = (form) => privateInstance.post(`/v1/admin/uploads/footer/logo`, form);
export const getFooterSettings = () => privateInstance.get('/v1/admin/customize/footer');