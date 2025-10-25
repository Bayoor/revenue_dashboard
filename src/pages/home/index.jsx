import { Header } from "@/components/layout/Header";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { WalletCard } from "@/components/dashboard/WalletCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TransactionList } from "../../components/transaction/TransactionList";
import { useFetch } from "../../hooks/useFetch";
import { getUser, getWallet } from "../../services/user";

const Home = () => {
  const {
    data: user,
    loading: userLoading,
    error: userError,
  } = useFetch(() => getUser(), true);

  const {
    data: wallet,
    loading: walletLoading,
    error: walletError,
  } = useFetch(() => getWallet(), true);

  if (userLoading || walletLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (userError || walletError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-red-500">
        Error: {userError || walletError}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-3 z-50 px-4">
        {user && (
          <Header
            userName={`${user.first_name} ${user.last_name}`}
            email={user.email}
          />
        )}
      </div>

      <main className="p-6 px-6 md:px-12 lg:px-[140px] pt-24 md:pt-28 lg:pt-32">
        <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-0">
          <div className="max-lg:hidden w-12 h-48 self-end rounded-[100px] justify-center flex flex-col relative -left-28 -top-14 shadow-app">
            <img
              src="./icons/app-bar-list.svg"
              alt=""
              className="grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer"
            />
            <img
              src="./icons/store.svg"
              alt=""
              className="grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer"
            />
            <img
              src="./icons/medkit.svg"
              alt=""
              className="grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer"
            />
            <img
              src="./icons/invoice.svg"
              alt=""
              className="grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer"
            />
          </div>
          <div className="w-full lg:flex-1">
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 lg:gap-16 mb-6">
                <div>
                  <p className="text-sm text-secondary-foreground mb-2">
                    Available Balance
                  </p>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                    USD{" "}
                    {wallet?.balance?.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }) || "0.00"}
                  </p>
                </div>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-[100px] px-7 py-3.5 w-full sm:w-auto">
                  Withdraw
                </Button>
              </div>
              <div className="w-full max-w-[85%] -ml-">
                <RevenueChart />
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[18%]">
            <Card className="mb-8">
              <WalletCard
                label="Ledger Balance"
                value={`USD ${wallet?.ledger_balance?.toLocaleString() || 0}`}
              />
              <WalletCard
                label="Total Payout"
                value={`USD ${wallet?.total_payout?.toLocaleString() || 0}`}
              />
              <WalletCard
                label="Total Revenue"
                value={`USD ${wallet?.total_revenue?.toLocaleString() || 0}`}
              />
              <WalletCard
                label="Pending Payout"
                value={`USD ${wallet?.pending_payout?.toLocaleString() || 0}`}
              />
            </Card>
          </div>
        </div>

        <TransactionList />
      </main>
    </div>
  );
};

export default Home;
