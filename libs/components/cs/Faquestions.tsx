import React, { SyntheticEvent, useState } from "react";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import { AccordionDetails, Box, Stack, Typography } from "@mui/material";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import { useRouter } from "next/router";
import { styled } from "@mui/material/styles";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { useTranslation } from "react-i18next";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));
const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: "1.4rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? "rgba(255, 255, 255, .05)" : "#fff",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(180deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const Faquestions = () => {
  const device = useDeviceDetect();
  const router = useRouter();
  const { t } = useTranslation("common");
  const [category, setCategory] = useState<string>("service");
  const [expanded, setExpanded] = useState<string | false>("panel1");

  /** APOLLO REQUESTS **/
  /** LIFECYCLES **/

  /** HANDLERS **/
  const changeCategoryHandler = (category: string) => {
    setCategory(category);
  };

  const handleChange =
    (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  const data: any = {
    service: [
      {
        id: "00f5a45ed8897f8090116b01",
        subject: "How do I choose the right service for my hair type?",
        content:
          "Select a service based on your hair length, texture, and desired outcome. Our barbers can guide you toward the best option.",
      },
      {
        id: "00f5a45ed8897f8090116b02",
        subject: "Do I need to wash my hair before the service?",
        content:
          "Not required. Our barbers will wash your hair when needed to ensure the best styling results.",
      },
      {
        id: "00f5a45ed8897f8090116b03",
        subject: "How long does a typical haircut or styling session take?",
        content:
          "Standard haircuts take 20–30 minutes, while specialized services like perms or painting require additional time.",
      },
      {
        id: "00f5a45ed8897f8090116b04",
        subject: "Can I request a custom style or show reference photos?",
        content:
          "Yes. You may bring reference images, and our barbers will adapt the style to complement your features.",
      },
      {
        id: "00f5a45ed8897f8090116b05",
        subject: "Do you offer consultations before choosing a service?",
        content:
          "Yes, our barbers provide brief consultations to recommend the most suitable cut, treatment, or styling method.",
      },
      {
        id: "00f5a45ed8897f8090116b06",
        subject: "Are kids’ haircuts available at Cropper?",
        content:
          "Yes. We offer gentle, comfortable haircuts for children up to age 10.",
      },
      {
        id: "00f5a45ed8897f8090116b07",
        subject: "How often should I return for a haircut or maintenance?",
        content:
          "Most clients return every 2–4 weeks depending on hair growth and personal style preferences.",
      },
      {
        id: "00f5a45ed8897f8090116b08",
        subject: "Do you provide beard trimming and shaping?",
        content:
          "Yes. Our barbers offer professional beard trimming, shaping, and styling for clean, defined lines.",
      },
      {
        id: "00f5a45ed8897f8090116b09",
        subject: "Can I combine multiple services in one appointment?",
        content:
          "Absolutely. You may book combined services such as haircut, beard trim, and styling in a single visit.",
      },
      {
        id: "00f5a45ed8897f8090116b10",
        subject: "Do you offer hair coloring or painting services?",
        content:
          "Yes. We provide professional hair painting for subtle tones or bold transformations, performed by skilled specialists.",
      },
    ],
    users: [
      {
        id: "00f5a45ed8897f8090116a03",
        subject:
          "What should customers pay attention to before choosing a service?",
        content:
          "Customers should check which service suits their hair type and desired style. Understanding your goal helps the barber deliver the best result.",
      },
      {
        id: "00f5a45ed8897f8090116a85",
        subject: "How can I choose a service that fits my budget?",
        content:
          "Review the service menu and compare prices based on your needs. Our staff can recommend the best options within your budget.",
      },
      {
        id: "00f5a45ed8897f8090116a84",
        subject: "Do I need anything prepared before my appointment?",
        content:
          "You only need to arrive on time with clean or manageable hair. Our barbers will guide you if anything else is required for specific services.",
      },
      {
        id: "00f5a45ed8897f8090116a83",
        subject: "What factors should I consider when choosing a barber?",
        content:
          "Consider the barber’s specialty, style, experience, and past customer reviews. Each barber at Cropper has unique strengths to match your needs.",
      },
      {
        id: "00f5a45ed8897f8090116a82",
        subject: "Can I request adjustments to my haircut or style?",
        content:
          "Yes, you can. Feel free to discuss your preferences. Our barbers welcome feedback and will fine-tune the style to your satisfaction.",
      },
      {
        id: "00f5a45ed8897f8090116a81",
        subject:
          "What are some red flags to watch for in hair or scalp condition?",
        content:
          "Look for signs like dryness, flaking, irritation, or breakage. If needed, our barbers can recommend treatments or care routines.",
      },
      {
        id: "00f5a45ed8897f8090116a80",
        subject:
          "Do you provide help in choosing the right treatment or style?",
        content:
          "Yes, our barbers offer personalized consultations and recommend the best cut, color, or treatment based on your face shape and hair condition.",
      },
      {
        id: "00f5a45ed8897f8090116a79",
        subject: "How long does it usually take to get the right style?",
        content:
          "Timing depends on the service. Simple cuts are quick, while perms or coloring require more time. We work efficiently while ensuring quality.",
      },
      {
        id: "00f5a45ed8897f8090116a78",
        subject:
          "What are the advantages of choosing a professional barbershop?",
        content:
          "Professional barbers provide expertise, precision, hygiene, and personalized style recommendations, ensuring consistent and high-quality results.",
      },
      {
        id: "00f5a45ed8897f8090116a77",
        subject:
          "What happens if I CHANGE my mind about a service after booking?",
        content:
          "You can only cancel your reservation!. But keep in mind that if you cancel 3 times, your account will be BLOCKED",
      },
    ],
    barbers: [
      {
        id: "00f5a45ed8897f8090116a04",
        subject: "What should I do if I want to become a barber at Cropper?",
        content:
          "If you wish to join Cropper, review our professional standards and submit an application to the admin for evaluation.",
      },
      {
        id: "00f5a45ed8897f8090116a62",
        subject:
          "What qualifications do I need to become a professional barber?",
        content:
          "Complete barber training, develop strong cutting and styling skills, and maintain a solid understanding of grooming techniques.",
      },
      {
        id: "00f5a45ed8897f8090116a63",
        subject: "How can new barbers attract clients?",
        content:
          "Showcase your work, stay active on social media, build trust with customers, and deliver consistent quality.",
      },
      {
        id: "00f5a45ed8897f8090116a64",
        subject: "What are effective ways to promote barber services?",
        content:
          "Use social platforms, share before–after photos, engage with local communities, and maintain a clean, stylish portfolio.",
      },
      {
        id: "00f5a45ed8897f8090116a65",
        subject: "How should barbers handle customer requests and adjustments?",
        content:
          "Listen carefully, offer expert advice, and communicate clearly to ensure the final result meets the client’s expectations.",
      },
      {
        id: "00f5a45ed8897f8090116a66",
        subject: "How do barbers stay updated with modern grooming trends?",
        content:
          "Attend workshops, follow industry leaders, practice new techniques, and stay informed about emerging styles.",
      },
      {
        id: "00f5a45ed8897f8090116a67",
        subject: "How do I handle challenging clients or situations?",
        content:
          "Approach each case with calm professionalism, listen attentively, and work toward a solution that ensures comfort and satisfaction.",
      },
      {
        id: "00f5a45ed8897f8090116a68",
        subject: "What tools and technologies should modern barbers use?",
        content:
          "Use high-quality clippers, razors, styling tools, and digital platforms for booking, portfolios, and customer communication.",
      },
      {
        id: "00f5a45ed8897f8090116a69",
        subject: "How do barbers maintain hygiene and safety standards?",
        content:
          "Follow sanitation rules, sterilize tools after every client, and comply with health guidelines to ensure a safe environment.",
      },
      {
        id: "00f5a45ed8897f8090116a70",
        subject:
          "What strategies help barbers grow their career and reputation?",
        content:
          "Provide consistent quality, build strong client relationships, seek feedback, and continually improve technical skills.",
      },
    ],
    community: [
      {
        id: "00f5a45ed8897f8090116a06",
        subject:
          "What should I do if there is abusive or criminal behavior in the community section?",
        content:
          "If you encounter this situation, please report it immediately or contact the admin!",
      },
      {
        id: "00f5a45ed8897f8090116a44",
        subject:
          "How can I participate in the community section of your website?",
        content: "Create an account and engage in discussions.",
      },
      {
        id: "00f5a45ed8897f8090116a45",
        subject: "Are there guidelines for posting?",
        content: "Yes, follow our community guidelines.",
      },
      {
        id: "00f5a45ed8897f8090116a46",
        subject: "What should I do if I encounter spam or irrelevant posts?",
        content: "Report them to the admin.",
      },
      {
        id: "00f5a45ed8897f8090116a47",
        subject:
          "Can I connect with other members outside of the community section?",
        content: "Currently, no.",
      },
      {
        id: "00f5a45ed8897f8090116a48",
        subject: "Can I share personal experiences or recommendations?",
        content:
          "Yes, if relevant you can share personal experiences and recommendations.",
      },
      {
        id: "00f5a45ed8897f8090116a49",
        subject: "How can I ensure privacy?",
        content: "Avoid sharing sensitive information.",
      },
      {
        id: "00f5a45ed8897f8090116a50",
        subject: "How can I contribute positively?",
        content: "Respect others and engage constructively.",
      },
      {
        id: "00f5a45ed8897f8090116a51",
        subject: "What if I notice misinformation?",
        content: "Provide correct information or report to the admin.",
      },
      {
        id: "00f5a45ed8897f8090116a52",
        subject: "Are there moderators?",
        content: "Yes, we have moderators.",
      },
    ],
    other: [
      {
        id: "00f5a45ed8897f8090116a40",
        subject:
          "Who should I contact if I want to purchase the Cropper brand?",
        content:
          "We currently have no plans to sell the Cropper brand or platform.",
      },
      {
        id: "00f5a45ed8897f8090116a39",
        subject: "Can I advertise my products or services on your website?",
        content:
          "We do not offer advertising space on our website at this time.",
      },
      {
        id: "00f5a45ed8897f8090116a38",
        subject: "Are sponsorships or collaborations available with Cropper?",
        content:
          "We are not accepting sponsorship collaborations at the moment.",
      },
      {
        id: "00f5a45ed8897f8090116a36",
        subject: "Can I submit grooming articles or blog posts to your site?",
        content:
          "We are not accepting guest posts or article submissions currently.",
      },
      {
        id: "00f5a45ed8897f8090116a35",
        subject: "Do you offer a referral program for recommending Cropper?",
        content: "We do not have a referral program available at this time.",
      },
      {
        id: "00f5a45ed8897f8090116a34",
        subject: "Is there an affiliate program for promoting your services?",
        content: "We do not provide affiliate partnerships at the moment.",
      },
      {
        id: "00f5a45ed8897f8090116a33",
        subject: "Do you sell Cropper merchandise or branded items?",
        content: "We do not currently offer merchandise for sale.",
      },
      {
        id: "00f5a45ed8897f8090116a32",
        subject: "Are there any job opportunities at the Cropper barbershop?",
        content: "We do not have open positions at this time.",
      },
      {
        id: "00f5a45ed8897f8090116a31",
        subject: "Do you host grooming workshops or barbering events?",
        content: "We are not hosting events or workshops at the moment.",
      },
      {
        id: "00f5a45ed8897f8090116a30",
        subject: "Can I request new features for the Cropper platform?",
        content: "We are not accepting custom feature requests right now.",
      },
    ],
  };

  if (device === "mobile") {
    return (
      <Stack className={"faq-content-mobile"}>
        <Box className={"categories-mobile"} component={"div"}>
          <div
            className={category === "service" ? "active" : ""}
            onClick={() => changeCategoryHandler("service")}
          >
            {t("Service")}
          </div>
          <div
            className={category === "users" ? "active" : ""}
            onClick={() => changeCategoryHandler("users")}
          >
            {t("For Users")}
          </div>
          <div
            className={category === "barbers" ? "active" : ""}
            onClick={() => changeCategoryHandler("barbers")}
          >
            {t("For Barbers")}
          </div>
          <div
            className={category === "community" ? "active" : ""}
            onClick={() => changeCategoryHandler("community")}
          >
            {t("Community")}
          </div>
          <div
            className={category === "other" ? "active" : ""}
            onClick={() => changeCategoryHandler("other")}
          >
            {t("Other")}
          </div>
        </Box>
        <Box className={"wrap-mobile"} component={"div"}>
          {data[category] &&
            data[category].map((ele: any) => (
              <Accordion
                expanded={expanded === ele?.id}
                onChange={handleChange(ele?.id)}
                key={ele?.subject}
              >
                <AccordionSummary
                  id="panel1d-header"
                  className="question"
                  aria-controls="panel1d-content"
                >
                  <Typography className="badge" variant={"h4"}>
                    Q
                  </Typography>
                  <Typography className="question-text">
                    {t(ele?.subject)}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack className={"answer flex-box"}>
                    <Typography
                      className="badge"
                      variant={"h4"}
                      color={"primary"}
                    >
                      A
                    </Typography>
                    <Typography className="answer-text">
                      {t(ele?.content)}
                    </Typography>
                  </Stack>
                </AccordionDetails>
              </Accordion>
            ))}
        </Box>
      </Stack>
    );
  } else {
    return (
      <Stack className={"faq-content"}>
        <Box className={"categories"} component={"div"}>
          <div
            className={category === "service" ? "active" : ""}
            onClick={() => {
              changeCategoryHandler("service");
            }}
          >
            {t("Service")}
          </div>
          <div
            className={category === "users" ? "active" : ""}
            onClick={() => {
              changeCategoryHandler("users");
            }}
          >
            {t("For Users")}
          </div>
          <div
            className={category === "barbers" ? "active" : ""}
            onClick={() => {
              changeCategoryHandler("barbers");
            }}
          >
            {t("For Barbers")}
          </div>
          <div
            className={category === "community" ? "active" : ""}
            onClick={() => {
              changeCategoryHandler("community");
            }}
          >
            {t("Community")}
          </div>
          <div
            className={category === "other" ? "active" : ""}
            onClick={() => {
              changeCategoryHandler("other");
            }}
          >
            {t("Other")}
          </div>
        </Box>
        <Box className={"wrap"} component={"div"}>
          {data[category] &&
            data[category].map((ele: any) => (
              <Accordion
                expanded={expanded === ele?.id}
                onChange={handleChange(ele?.id)}
                key={ele?.subject}
              >
                <AccordionSummary
                  id="panel1d-header"
                  className="question"
                  aria-controls="panel1d-content"
                >
                  <Typography className="badge" variant={"h4"}>
                    Q
                  </Typography>
                  <Typography> {t(ele?.subject)}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack className={"answer flex-box"}>
                    <Typography
                      className="badge"
                      variant={"h4"}
                      color={"primary"}
                    >
                      A
                    </Typography>
                    <Typography> {t(ele?.content)}</Typography>
                  </Stack>
                </AccordionDetails>
              </Accordion>
            ))}
        </Box>
      </Stack>
    );
  }
};

export default Faquestions;
