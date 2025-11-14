import * as VariationService from '../products/variations';

export const fetchVariations = async (args) => VariationService.fetchVariations(args);

export const addVariation = async (...args) => VariationService.addVariation(...args);

export const updateVariation = async (args) => VariationService.updateVariation(args);

export const deleteVariation = async (args) => VariationService.deleteVariation(args);