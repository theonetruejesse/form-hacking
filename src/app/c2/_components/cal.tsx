"use client";

import { InvalidLink } from "@/src/components/invalidLink";
import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
import { pageIdToLink } from "./modules";
import { useQuery } from "@tanstack/react-query";

export type Cal2Props = {
  id: string;
  name: string;
  pageNumber: number;
  setCalIsScheduled: any; //change to type
  onSchedulingComplete: () => void;
};

export const CalC2 = ({
  id,
  name,
  pageNumber,
  setCalIsScheduled,
  onSchedulingComplete,
}: Cal2Props) => {
  const calLink = pageIdToLink.get(pageNumber.toString()); //need to pass in page id and change the modules page
  console.log("callink", calLink);
  const webhook = `https://hook.us1.make.com/p96owipfvhi0af2yk4i1to33r8solivk?id=${id}`;

  const { data, error, isLoading } = useQuery({
    queryKey: ["c2 cal prefills", id],
    queryFn: () => fetch(webhook).then((res) => res.json()),
  });

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({});
      cal("ui", {
        styles: { branding: { brandColor: "#000000" } },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
      cal("on", {
        action: "bookingSuccessful",
        callback: (e) => {
          console.log("bookingSuccessful", e);
          setCalIsScheduled(true);
          onSchedulingComplete();
        },
      });
    })();
  });

  if (!calLink) return <InvalidLink />;
  if (isLoading) return <div>Loading...</div>;
  if (error || !data) return <InvalidLink />;

  const email = data["parentEmail"];
  const guests = data["studentEmail"];
  const smsReminderNumber = data["studentNumber"];

  if (!email || !guests || !smsReminderNumber) return <InvalidLink />;

  return (
    <Cal
      calLink={calLink}
      style={{ width: "100%", height: "100%", overflow: "scroll" }}
      config={{
        layout: "month_view",
        name,
        email,
        id,
        guests,
        smsReminderNumber,
      }}
    />
  );
};
