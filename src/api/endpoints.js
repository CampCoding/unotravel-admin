import api from "./config.js";

const multipart = { headers: { "Content-Type": undefined } };

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (data) => api.post("/admin/auth/login", data),
  logout: (refreshToken) => api.post("/admin/auth/logout", { refreshToken }),
  getProfile: () => api.get("/admin/auth/profile"),
  updateProfile: (data) => api.put("/admin/auth/profile", data),
};

// ─── Banners ─────────────────────────────────────────────────────────────────
export const bannersAPI = {
  list: (params) => api.get("/admin/banners/list", { params }),
  getById: (id) => api.get(`/admin/banners/${id}`),
  create: (formData) => api.post("/admin/banners/create", formData, multipart),
  update: (id, formData) => api.put(`/admin/banners/${id}/update`, formData, multipart),
  delete: (id) => api.delete(`/admin/banners/${id}/delete`),
};

// ─── Services ─────────────────────────────────────────────────────────────────
export const servicesAPI = {
  list: () => api.get("/admin/services/list"),
  getById: (id) => api.get(`/admin/services/${id}`),
  create: (formData) => api.post("/admin/services/create", formData, multipart),
  update: (id, formData) => api.put(`/admin/services/${id}/update`, formData, multipart),
  delete: (id) => api.delete(`/admin/services/${id}/delete`),
};

// ─── Agents (Sales Agents / Brands) ───────────────────────────────────────────
export const agentsAPI = {
  list: (type) => api.get("/admin/agents/list", { params: type ? { type } : undefined }),
  getById: (id) => api.get(`/admin/agents/${id}`),
  create: (formData) => api.post("/admin/agents/create", formData, multipart),
  update: (id, formData) => api.put(`/admin/agents/${id}/update`, formData, multipart),
  delete: (id) => api.delete(`/admin/agents/${id}/delete`),
};

// ─── News Articles ─────────────────────────────────────────────────────────────
export const newsAPI = {
  list: (params = {}) => api.get("/admin/news/articles/list", { params }),
  getById: (id) => api.get(`/admin/news/articles/${id}`),
  create: (formData) => api.post("/admin/news/articles/create", formData, multipart),
  update: (id, formData) => api.put(`/admin/news/articles/${id}/update`, formData, multipart),
  delete: (id) => api.delete(`/admin/news/articles/${id}/delete`),
};

// ─── News Categories ───────────────────────────────────────────────────────────
export const newsCategoriesAPI = {
  list: () => api.get("/admin/news/categories/list"),
  getById: (id) => api.get(`/admin/news/categories/${id}`),
  create: (data) => api.post("/admin/news/categories/create", data),
  update: (id, data) => api.put(`/admin/news/categories/${id}/update`, data),
  delete: (id) => api.delete(`/admin/news/categories/${id}/delete`),
};

// ─── Reels ─────────────────────────────────────────────────────────────────────
export const reelsAPI = {
  list: () => api.get("/admin/reels/list"),
  getById: (id) => api.get(`/admin/reels/${id}`),
  create: (formData) => api.post("/admin/reels/create", formData, multipart),
  update: (id, formData) => api.put(`/admin/reels/${id}/update`, formData, multipart),
  delete: (id) => api.delete(`/admin/reels/${id}/delete`),
};

// ─── Logos ─────────────────────────────────────────────────────────────────────
export const logosAPI = {
  list: () => api.get("/admin/logos/list"),
  getById: (id) => api.get(`/admin/logos/${id}`),
  create: (formData) => api.post("/admin/logos/create", formData, multipart),
  update: (id, formData) => api.put(`/admin/logos/${id}/update`, formData, multipart),
  delete: (id) => api.delete(`/admin/logos/${id}/delete`),
};

// ─── Offers ─────────────────────────────────────────────────────────────────────
export const offersAPI = {
  list: () => api.get("/admin/offers/list"),
  getById: (id) => api.get(`/admin/offers/${id}`),
  create: (formData) => api.post("/admin/offers/create", formData, multipart),
  update: (id, formData) => api.put(`/admin/offers/${id}/update`, formData, multipart),
  delete: (id) => api.delete(`/admin/offers/${id}/delete`),
};

// ─── Why Choose Us Items ───────────────────────────────────────────────────────
export const whyChooseUsItemsAPI = {
  list: () => api.get("/admin/why-choose-us/items/list"),
  getById: (id) => api.get(`/admin/why-choose-us/items/${id}`),
  create: (formData) => api.post("/admin/why-choose-us/items/create", formData, multipart),
  update: (id, formData) => api.put(`/admin/why-choose-us/items/${id}/update`, formData, multipart),
  delete: (id) => api.delete(`/admin/why-choose-us/items/${id}/delete`),
};

// ─── Travel Support ────────────────────────────────────────────────────────────
export const travelSupportAPI = {
  list: () => api.get("/admin/travel-support/list"),
  getById: (id) => api.get(`/admin/travel-support/${id}`),
  create: (data) => api.post("/admin/travel-support/create", data),
  update: (id, data) => api.put(`/admin/travel-support/${id}/update`, data),
  delete: (id) => api.delete(`/admin/travel-support/${id}/delete`),
};

// ─── Fare Flight Features ──────────────────────────────────────────────────────
export const fareFlightFeaturesAPI = {
  list: () => api.get("/admin/fare-flight-features/list"),
  getById: (id) => api.get(`/admin/fare-flight-features/${id}`),
  create: (formData) => api.post("/admin/fare-flight-features/create", formData, multipart),
  update: (id, formData) => api.put(`/admin/fare-flight-features/${id}/update`, formData, multipart),
  delete: (id) => api.delete(`/admin/fare-flight-features/${id}/delete`),
};

// ─── Minors Lounge ─────────────────────────────────────────────────────────────
export const minorsLoungeAPI = {
  list: () => api.get("/admin/minors-lounge/list"),
  getById: (id) => api.get(`/admin/minors-lounge/${id}`),
  create: (data) => api.post("/admin/minors-lounge/create", data),
  update: (id, data) => api.put(`/admin/minors-lounge/${id}/update`, data),
  delete: (id) => api.delete(`/admin/minors-lounge/${id}/delete`),
};

// ─── Best Travelers ────────────────────────────────────────────────────────────
export const bestTravelersAPI = {
  list: () => api.get("/admin/best-travelers/list"),
  getById: (id) => api.get(`/admin/best-travelers/${id}`),
  create: (formData) => api.post("/admin/best-travelers/create", formData, multipart),
  update: (id, formData) => api.put(`/admin/best-travelers/${id}/update`, formData, multipart),
  delete: (id) => api.delete(`/admin/best-travelers/${id}/delete`),
};

// ─── Page Sections ─────────────────────────────────────────────────────────────
export const pageSectionsAPI = {
  list: (page_name) => api.get("/admin/page-sections/list", { params: page_name ? { page_name } : undefined }),
  getById: (id) => api.get(`/admin/page-sections/${id}`),
  create: (data) => api.post("/admin/page-sections/create", data),
  update: (id, data) => api.put(`/admin/page-sections/${id}/update`, data),
  delete: (id) => api.delete(`/admin/page-sections/${id}/delete`),
};

// ─── About Section (single record) ─────────────────────────────────────────────
export const aboutAPI = {
  get: () => api.get("/admin/about"),
  update: (formData) => api.put("/admin/about/update", formData, multipart),
};

// ─── Application Section (single record) ───────────────────────────────────────
export const applicationAPI = {
  get: () => api.get("/admin/application"),
  update: (formData) => api.put("/admin/application/update", formData, multipart),
};

// ─── Newsletter Section (single record) ────────────────────────────────────────
export const newsletterAPI = {
  get: () => api.get("/admin/newsletter"),
  update: (formData) => api.put("/admin/newsletter/update", formData, multipart),
};

// ─── Why Choose Us Banners ─────────────────────────────────────────────────────
export const whyChooseUsBannersAPI = {
  list: () => api.get("/admin/why-choose-us/banners/list"),
  getById: (id) => api.get(`/admin/why-choose-us/banners/${id}`),
  create: (formData) => api.post("/admin/why-choose-us/banners/create", formData, multipart),
  update: (id, formData) => api.put(`/admin/why-choose-us/banners/${id}/update`, formData, multipart),
  delete: (id) => api.delete(`/admin/why-choose-us/banners/${id}/delete`),
};

// ─── Contact Hero ──────────────────────────────────────────────────────────────
export const contactHeroAPI = {
  get: () => api.get("/admin/contact/hero"),
  update: (formData) => api.put("/admin/contact/hero/update", formData, multipart),
};

// ─── Contact Numbers ───────────────────────────────────────────────────────────
export const contactNumbersAPI = {
  list: () => api.get("/admin/contact/numbers/list"),
  getById: (id) => api.get(`/admin/contact/numbers/${id}`),
  create: (formData) => api.post("/admin/contact/numbers/create", formData, multipart),
  update: (id, formData) => api.put(`/admin/contact/numbers/${id}/update`, formData, multipart),
  delete: (id) => api.delete(`/admin/contact/numbers/${id}/delete`),
};

// ─── Contact Form Section (single record) ─────────────────────────────────────
export const contactFormAPI = {
  get: () => api.get("/admin/contact/form"),
  update: (data) => api.put("/admin/contact/form/update", data),
};

// ─── Company Branches ──────────────────────────────────────────────────────────
export const companyBranchesAPI = {
  list: () => api.get("/admin/contact/branches/list"),
  getById: (id) => api.get(`/admin/contact/branches/${id}`),
  create: (data) => api.post("/admin/contact/branches/create", data),
  update: (id, data) => api.put(`/admin/contact/branches/${id}/update`, data),
  delete: (id) => api.delete(`/admin/contact/branches/${id}/delete`),
};

// ─── Tour Destinations ─────────────────────────────────────────────────────────
export const tourDestinationsAPI = {
  list: () => api.get("/admin/tour-destinations/list"),
  getById: (id) => api.get(`/admin/tour-destinations/${id}`),
  create: (formData) => api.post("/admin/tour-destinations/create", formData, multipart),
  update: (id, formData) => api.put(`/admin/tour-destinations/${id}/update`, formData, multipart),
  delete: (id) => api.delete(`/admin/tour-destinations/${id}/delete`),
};

// ─── Site Settings ─────────────────────────────────────────────────────────────
export const siteSettingsAPI = {
  get: () => api.get("/admin/site-settings"),
  update: (data) => api.put("/admin/site-settings/update", data),
};

// ─── Tours ────────────────────────────────────────────────────────────────────
export const toursAPI = {
  list: (params) => api.get("/admin/tours/list", { params }),
  getById: (id) => api.get(`/admin/tours/${id}`),
  create: (data) => api.post("/admin/tours/create", data),
  update: (id, data) => api.put(`/admin/tours/${id}/update`, data),
  delete: (id) => api.delete(`/admin/tours/${id}/delete`),
  addMedia: (id, formData) => api.post(`/admin/tours/${id}/media/add`, formData, { headers: { "Content-Type": undefined } }),
  setMainMedia: (tourId, mediaId) => api.put(`/admin/tours/${tourId}/media/${mediaId}/set-main`),
  deleteMedia: (tourId, mediaId) => api.delete(`/admin/tours/${tourId}/media/${mediaId}/delete`),
};

// ─── Offer Registrations ──────────────────────────────────────────────────────
export const offerRegistrationsAPI = {
  list: (params) => api.get("/admin/offer-registrations/list", { params }),
  updatePayment: (id, data) => api.put(`/admin/offer-registrations/${id}/payment`, data),
  delete: (id) => api.delete(`/admin/offer-registrations/${id}/delete`),
};

// ─── Tour Bookings ────────────────────────────────────────────────────────────
export const tourBookingsAPI = {
  list: (params) => api.get("/admin/tour-bookings/list", { params }),
  updatePayment: (id, data) => api.put(`/admin/tour-bookings/${id}/payment`, data),
  delete: (id) => api.delete(`/admin/tour-bookings/${id}/delete`),
};

// ─── International Tours ──────────────────────────────────────────────────────
export const intlToursAPI = {
  bannersList:   ()        => api.get("/admin/intl-tours/banners/list"),
  bannerCreate:  (fd)      => api.post("/admin/intl-tours/banners/create", fd, { headers: { "Content-Type": undefined } }),
  bannerUpdate:  (id, fd)  => api.put(`/admin/intl-tours/banners/${id}/update`, fd, { headers: { "Content-Type": undefined } }),
  bannerDelete:  (id)      => api.delete(`/admin/intl-tours/banners/${id}/delete`),
  featuresList:  ()        => api.get("/admin/intl-tours/features/list"),
  featureCreate: (data)    => api.post("/admin/intl-tours/features/create", data),
  featureUpdate: (id, data)=> api.put(`/admin/intl-tours/features/${id}/update`, data),
  featureDelete: (id)      => api.delete(`/admin/intl-tours/features/${id}/delete`),
};

// ─── Visa Services ───────────────────────────────────────────────────────────
export const visaAPI = {
  // Banners
  bannersList:        ()           => api.get("/admin/visa/banners/list"),
  bannerCreate:       (fd)         => api.post("/admin/visa/banners/create", fd, { headers: { "Content-Type": undefined } }),
  bannerUpdate:       (id, fd)     => api.put(`/admin/visa/banners/${id}/update`, fd, { headers: { "Content-Type": undefined } }),
  bannerDelete:       (id)         => api.delete(`/admin/visa/banners/${id}/delete`),
  // Countries
  countriesList:      ()        => api.get("/admin/visa/countries"),
  countryCreate:      (data)    => api.post("/admin/visa/countries", data),
  countryUpdate:      (id, data)=> api.put(`/admin/visa/countries/${id}`, data),
  countryDelete:      (id)      => api.delete(`/admin/visa/countries/${id}`),
  // Visa Types
  visaTypesList:      ()        => api.get("/admin/visa/visa-types"),
  visaTypeCreate:     (data)    => api.post("/admin/visa/visa-types", data),
  visaTypeUpdate:     (id, data)=> api.put(`/admin/visa/visa-types/${id}`, data),
  visaTypeDelete:     (id)      => api.delete(`/admin/visa/visa-types/${id}`),
  // Passport Types
  passportTypesList:  ()        => api.get("/admin/visa/passport-types"),
  passportTypeCreate: (data)    => api.post("/admin/visa/passport-types", data),
  passportTypeUpdate: (id, data)=> api.put(`/admin/visa/passport-types/${id}`, data),
  passportTypeDelete: (id)      => api.delete(`/admin/visa/passport-types/${id}`),
  // Applications
  applicationsList:   (params)  => api.get("/admin/visa/applications", { params }),
  applicationStatus:  (id, data)=> api.put(`/admin/visa/applications/${id}/status`, data),
  applicationDelete:  (id)      => api.delete(`/admin/visa/applications/${id}`),
};

// ─── Umrah ────────────────────────────────────────────────────────────────────
const umrahMultipart = { headers: { "Content-Type": undefined } };
export const umrahAPI = {
  // Banners
  bannersList: () => api.get("/admin/umrah/banners/list"),
  bannerCreate: (fd) => api.post("/admin/umrah/banners/create", fd, umrahMultipart),
  bannerUpdate: (id, fd) => api.put(`/admin/umrah/banners/${id}/update`, fd, umrahMultipart),
  bannerDelete: (id) => api.delete(`/admin/umrah/banners/${id}/delete`),
  // Packages
  packagesList: () => api.get("/admin/umrah/packages/list"),
  packageGet: (id) => api.get(`/admin/umrah/packages/${id}`),
  packageCreate: (fd) => api.post("/admin/umrah/packages/create", fd, umrahMultipart),
  packageUpdate: (id, fd) => api.put(`/admin/umrah/packages/${id}/update`, fd, umrahMultipart),
  packageDelete: (id) => api.delete(`/admin/umrah/packages/${id}/delete`),
  // Registrations
  registrationsList: (params) => api.get("/admin/umrah/registrations/list", { params }),
  updatePayment: (id, data) => api.put(`/admin/umrah/registrations/${id}/payment`, data),
  registrationDelete: (id) => api.delete(`/admin/umrah/registrations/${id}/delete`),
};

// ─── Legal Documents ──────────────────────────────────────────────────────────
export const legalAPI = {
  list:   ()            => api.get("/admin/legal"),
  get:    (slug)        => api.get(`/admin/legal/${slug}`),
  update: (slug, data)  => api.put(`/admin/legal/${slug}`, data),
};

// ─── Contact Messages ─────────────────────────────────────────────────────────
export const contactMessagesAPI = {
  list:       (params) => api.get("/admin/contact/messages/list", { params }),
  markRead:   (id)     => api.put(`/admin/contact/messages/${id}/read`),
  delete:     (id)     => api.delete(`/admin/contact/messages/${id}/delete`),
};

// ─── Ride Bookings ────────────────────────────────────────────────────────────
export const rideBookingsAPI = {
  list:         (params) => api.get("/admin/ride-bookings/list", { params }),
  updateStatus: (id, data) => api.put(`/admin/ride-bookings/${id}/status`, data),
  delete:       (id)     => api.delete(`/admin/ride-bookings/${id}/delete`),
};

// ─── Car Reservation ──────────────────────────────────────────────────────────
const carImg = { headers: { "Content-Type": undefined } };
export const carReservationAPI = {
  // Banners
  bannersList:   ()        => api.get("/admin/car-reservation/banners/list"),
  bannerCreate:  (fd)      => api.post("/admin/car-reservation/banners/create", fd, carImg),
  bannerUpdate:  (id, fd)  => api.put(`/admin/car-reservation/banners/${id}/update`, fd, carImg),
  bannerDelete:  (id)      => api.delete(`/admin/car-reservation/banners/${id}/delete`),
  // Fleet (Cars)
  carsList:      ()        => api.get("/admin/car-reservation/cars/list"),
  carGet:        (id)      => api.get(`/admin/car-reservation/cars/${id}`),
  carCreate:     (fd)      => api.post("/admin/car-reservation/cars/create", fd, carImg),
  carUpdate:     (id, fd)  => api.put(`/admin/car-reservation/cars/${id}/update`, fd, carImg),
  carDelete:     (id)      => api.delete(`/admin/car-reservation/cars/${id}/delete`),
  // Features (Why Choose Us)
  featuresList:  ()        => api.get("/admin/car-reservation/features/list"),
  featureCreate: (data)    => api.post("/admin/car-reservation/features/create", data),
  featureUpdate: (id, data)=> api.put(`/admin/car-reservation/features/${id}/update`, data),
  featureDelete: (id)      => api.delete(`/admin/car-reservation/features/${id}/delete`),
  // How It Works
  howItWorksList:   ()        => api.get("/admin/car-reservation/how-it-works/list"),
  howItWorksCreate: (data)    => api.post("/admin/car-reservation/how-it-works/create", data),
  howItWorksUpdate: (id, data)=> api.put(`/admin/car-reservation/how-it-works/${id}/update`, data),
  howItWorksDelete: (id)      => api.delete(`/admin/car-reservation/how-it-works/${id}/delete`),
  // Hero Settings
  heroGet:        ()        => api.get("/admin/car-reservation/hero/settings"),
  heroUpdate:     (data)    => api.put("/admin/car-reservation/hero/settings/update", data),
  // Stats
  statsList:      ()        => api.get("/admin/car-reservation/stats/list"),
  statCreate:     (data)    => api.post("/admin/car-reservation/stats/create", data),
  statUpdate:     (id, data)=> api.put(`/admin/car-reservation/stats/${id}/update`, data),
  statDelete:     (id)      => api.delete(`/admin/car-reservation/stats/${id}/delete`),
  // Bookings
  bookingsList:   (params) => api.get("/admin/car-reservation/bookings/list", { params }),
  bookingStatus:  (id, data)=> api.put(`/admin/car-reservation/bookings/${id}/status`, data),
  bookingDelete:  (id)     => api.delete(`/admin/car-reservation/bookings/${id}/delete`),
};
