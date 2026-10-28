import { Box, Rating, Stack, Typography } from "@mui/material";
import ListPagination from "../../libs/components/common/ListPagination";
import { NextPage } from "next";
import withLayoutBasic from "../../libs/components/layout/LayoutBasic";
import useDeviceDetect from "../../libs/hooks/useDeviceDetect";
import CommentIcon from "@mui/icons-material/Comment";
import { ServiceInquiry } from "../../libs/types/service/service.input";
import { useEffect, useState } from "react";
import { Service } from "../../libs/types/service/service";
import { useQuery } from "@apollo/client";
import { GET_SERVICES } from "../../apollo/user/query";
import { T } from "../../libs/types/common";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "react-i18next";

interface ServiceProps {
  initialInput?: ServiceInquiry;
}

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const OurService: NextPage<ServiceProps> = (props) => {
  const { t, i18n } = useTranslation("common");
  const device = useDeviceDetect();
  const [service, setService] = useState<Service[]>([]);
  const router = useRouter();
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const {
    initialInput = {
      page: 1,
      limit: 6,
      text: "",
      serviceStatus: "ACTIVE",
    },
  } = props;
  const [pageFilter, setPageFilter] = useState<any>(initialInput);

  const {
    loading: getServicesLoading,
    data: getServicesData,
    error: getServicesError,
    refetch: getServicesRefetch,
  } = useQuery(GET_SERVICES, {
    fetchPolicy: "cache-and-network",
    variables: { input: pageFilter },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setService(data?.getServices?.list);
      setTotal(data?.getServices?.metaCounter[0]?.total);
    },
  });

  useEffect(() => {
    if (!router.isReady) return;

    if (router.query.input) {
      const input_obj = JSON.parse(router?.query?.input as string);
      setPageFilter(input_obj);
      setCurrentPage(input_obj.page ?? 1);
    }
  }, [router.isReady, router.query.input]);

  const paginationChangeHandler = async (value: number) => {
    const nextFilter = {
      ...pageFilter,
      page: value,
    };

    setPageFilter(nextFilter);
    setCurrentPage(value);

    const encoded = encodeURIComponent(JSON.stringify(nextFilter));
    router.replace(`/service?input=${encoded}`, `/service?input=${encoded}`, {
      scroll: false,
    });
  };

  if (device === "mobile") {
    return (
      <Stack className="service-page-mobile">
        <Typography className="hero-title">{t("Services")}</Typography>
        <Stack className="container">
          <Stack className="service-main-title">
            {t("Our Signature Services")}
          </Stack>
          {service.length === 0 ? (
            <Box component={"div"} className="empty-list">
              {t("Services are not available")}
            </Box>
          ) : (
            <Stack className="service-list-mobile">
              {service.map((service: Service) => {
                return (
                  <Stack key={service._id} className="service-card-mobile">
                    <Box className="service-card-img">
                      <img
                        src={
                          service.serviceImages?.[0]
                            ? `${process.env.REACT_APP_API_URL}/${service.serviceImages[0]}`
                            : "/logo/Logo.svg"
                        }
                        alt=""
                      />
                      <Box className="service-price-tag">
                        ${service.servicePrice}
                      </Box>
                    </Box>
                    <Stack className="service-card-body">
                      <Typography className="service-title">
                        {service.serviceTitle}
                      </Typography>
                      <Typography className="service-desc">
                        {service.serviceDesc}
                      </Typography>
                      <Stack className="service-card-footer">
                        <span className="service-time">
                          {service.serviceDuration} {t("min")}
                        </span>
                        <Stack className="review-stars">
                          <Rating
                            value={5}
                            readOnly
                            size="small"
                            sx={{
                              "& .MuiRating-iconFilled": {
                                color: "#FFD700 !important",
                              },
                            }}
                          />
                          <span>({service.serviceReviews})</span>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Stack>
                );
              })}
            </Stack>
          )}
          {service.length !== 0 && (
            <ListPagination
              page={pageFilter.page ?? 1}
              pageCount={Math.ceil(total / pageFilter.limit)}
              onChange={paginationChangeHandler}
              total={total}
              totalLabel={`${total > 1 ? t("services") : t("service")} ${t("available")}`}
            />
          )}
        </Stack>
      </Stack>
    );
  } else {
    return (
      <Stack className="service-page">
        <Typography className="hero-title">{t("Services")}</Typography>
        <Stack className="container">
          <Stack className="service-main">
            <Stack className="service-main-title">{t("Our Signature Services")}</Stack>
            {service.length === 0 ? (
              <Box component={"div"} className="empty-list">
                {t("Services are not available")}
              </Box>
            ) : (
              <>
                {service.map((service: Service) => {
                  return (
                    <Stack key={service._id} className="service-card">
                      <Stack className="service-text-box">
                        <Typography className="service-title">
                          {service.serviceTitle}
                        </Typography>
                        <Typography className="service-desc">
                          {service.serviceDesc}
                        </Typography>
                        <Typography className="service-time">
                          {service.serviceDuration} {t("min")}
                        </Typography>
                        <Stack className="review-stars">
                          <Rating
                            value={5}
                            readOnly
                            sx={{
                              "& .MuiRating-iconFilled": {
                                color: "#FFD700 !important",
                              },
                            }}
                          />
                          <span>({service.serviceReviews})</span>
                        </Stack>
                      </Stack>
                      <Stack className="service-price">
                        ${service.servicePrice}
                      </Stack>
                      <Stack className="service-images">
                        {service.serviceImages?.map((img, index) => (
                          <img
                            key={index}
                            src={`${process.env.REACT_APP_API_URL}/${img}`}
                            alt=""
                          />
                        ))}
                      </Stack>
                    </Stack>
                  );
                })}
              </>
            )}
            {service.length !== 0 && (
              <ListPagination
                page={pageFilter.page ?? 1}
                pageCount={Math.ceil(total / pageFilter.limit)}
                onChange={paginationChangeHandler}
                total={total}
                totalLabel={`${total > 1 ? t("services") : t("service")} ${t("available")}`}
              />
            )}
          </Stack>
        </Stack>
      </Stack>
    );
  }
};

export default withLayoutBasic(OurService);
