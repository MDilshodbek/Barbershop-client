import { Box, Pagination, Rating, Stack, Typography } from "@mui/material";
import { NextPage } from "next";
import withLayoutBasic from "../../libs/components/layout/LayoutBasic";
import useDeviceDetect from "../../libs/hooks/useDeviceDetect";
import CommentIcon from "@mui/icons-material/Comment";
import { ServiceInquiry } from "../../libs/types/service/service.input";
import { ChangeEvent, useEffect, useState } from "react";
import { Service } from "../../libs/types/service/service";
import { useQuery } from "@apollo/client";
import { GET_SERVICES } from "../../apollo/user/query";
import { T } from "../../libs/types/common";
import { useRouter } from "next/router";

interface ServiceProps {
  initialInput?: ServiceInquiry;
}

const OurService: NextPage<ServiceProps> = (props) => {
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

  const paginationChangeHandler = async (
    event: ChangeEvent<unknown>,
    value: number
  ) => {
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
    return <Stack>Service Mobile Page</Stack>;
  } else {
    return (
      <Stack className="service-page">
        <Typography className="hero-title">Services</Typography>
        <Stack className="container">
          <Stack className="service-main">
            <Stack className="service-main-title">Our Signature Services</Stack>
            {service.length === 0 ? (
              <Box component={"div"} className="empty-list">
                Services are not available
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
                          {service.serviceDuration} min
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
                          <CommentIcon style={{ color: "#313e3b" }} />
                          <span>{service.serviceReviews}</span>
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
            <Stack className={"pagination"}>
              <Stack className="pagination-box">
                {service.length !== 0 &&
                  Math.ceil(total / pageFilter.limit) > 1 && (
                    <Stack className="pagination-box">
                      <Pagination
                        page={pageFilter.page ?? 1}
                        count={Math.ceil(total / pageFilter.limit)}
                        onChange={paginationChangeHandler}
                        shape="circular"
                        sx={{
                          "& .MuiPaginationItem-root": {
                            color: "#004034", // text color
                            borderColor: "#004034", // border color
                          },
                          "& .MuiPaginationItem-root.Mui-selected": {
                            backgroundColor: "#C6D984", // selected background
                            color: "#fff", // selected text
                          },
                          "& .MuiPaginationItem-root:hover": {
                            backgroundColor: "#C6D984", // hover background
                            color: "#fff",
                          },
                        }}
                      />
                    </Stack>
                  )}
              </Stack>
              {service.length !== 0 && (
                <span>
                  Total {total} service{total > 1 ? "s" : ""} available
                </span>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    );
  }
};

export default withLayoutBasic(OurService);
