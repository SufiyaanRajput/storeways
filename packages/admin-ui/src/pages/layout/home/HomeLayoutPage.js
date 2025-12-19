import { useEffect, useState } from "react";
import { PageHeader, LayoutContent, FullPageSpinner } from "../../../styles/common";
import { Button, notification } from "antd";
import QueryBoundary from "../../../internals/QueryBoundary";
import { useQuery, useMutation } from "@tanstack/react-query";
import DragAndDrop from "./DragAndDrop/DragAndDrop";
import { ButtonWrapper } from "./styles";
import {
  fetchLayout as fetchLayoutApi,
  updateLayout as updateLayoutApi,
  updateLayoutSection,
  uploadBannerImage,
  uploadPosterImage,
} from "../api";

const HomeLayout = () => {
  const [items, setItems] = useState([]);

  const {
    data: layoutItems = [],
    isFetching: isFetchingLayout,
    refetch: refetchLayout,
  } = useQuery({
    queryKey: ["adminLayout", "home"],
    queryFn: async () => {
      return await fetchLayoutApi({ page: "home" });
    },
    select: (response) => response?.data?.layout?.layout || response?.layout?.layout || [],
    keepPreviousData: true,
  });

  useEffect(() => {
    setItems(layoutItems || []);
  }, [layoutItems]);

  const updateLayoutMutation = useMutation({
    mutationFn: async (payload) => {
      return await updateLayoutApi(payload);
    },
    onSuccess: async () => {
      notification.success({
        message: "Layout updated successfully!",
        placement: "bottomRight",
      });
      await refetchLayout();
    },
    onError: () => {
      notification.error({
        message: "Layout update failed!",
        placement: "bottomRight",
      });
    },
  });

  const onSubmit = () => {
    updateLayoutMutation.mutate({ page: "home", layout: items });
  };

  return (
    <>
      <PageHeader title="Customise home page" />
      <LayoutContent>
        {isFetchingLayout ? (
          <FullPageSpinner />
        ) : (
          <>
            <DragAndDrop
              refetchLayout={refetchLayout}
              items={items}
              setItems={setItems}
              updateLayoutSection={updateLayoutSection}
              uploadBannerImage={uploadBannerImage}
              uploadPosterImage={uploadPosterImage}
            />
            <ButtonWrapper>
              <Button disabled={updateLayoutMutation.isPending} onClick={onSubmit} type="primary" size="large">
                Save
              </Button>
            </ButtonWrapper>
          </>
        )}
      </LayoutContent>
    </>
  );
};

const HomeLayoutPage = (props) => (
  <QueryBoundary>
    <HomeLayout {...props} />
  </QueryBoundary>
);

export default HomeLayoutPage;


