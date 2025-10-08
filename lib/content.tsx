import professionalPlaceholder from "/assets/images/professional-placeholder.png";
import weddingPlaceholder from "/assets/images/wedding-placeholder.jpg";
import jakePlaceholder from "/assets/images/jake-placeholder.png";

export const heroData = {
  description:
    "Professional videography and photography services for artists, corporate clients, and events.",
  serviceTitles: [
    "Professional Profiles",
    "Corporate Communications",
    "Special Events",
  ],
  videos: [
    { id: "hero-video-1", url: process.env.NEXT_PUBLIC_GOD_VIDEO },
    {
      id: "hero-video-2",
      url: process.env.NEXT_PUBLIC_PROFESSIONAL_VIDEO,
      placeholder: professionalPlaceholder,
    },
    {
      id: "hero-video-3",
      url: process.env.NEXT_PUBLIC_WEDDING_VIDEO,
      placeholder: weddingPlaceholder,
    },
    {
      id: "hero-video-4",
      url: process.env.NEXT_PUBLIC_JAKE_VIDEO,
      placeholder: jakePlaceholder,
      startTime: 5,
    },
  ],
};
