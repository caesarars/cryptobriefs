import CoinPage from "@/app/coin/[slug]/page";

export default function Page(props) {
  return <CoinPage {...props} params={{ slug: "near" }} />;
}
