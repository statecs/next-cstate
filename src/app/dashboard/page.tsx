import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function Dashboard() {
    const { isAuthenticated } = getKindeServerSession();

    return (await isAuthenticated()) ? (
        <div className="flex w-full h-[calc(100vh-110px)] max-w-[700px] gap-4 lg:grid-cols-4 lg:gap-10 text-white flex-grow justify-center items-center">
            <div className="lg:col-span-3">
                Woohoo!
                <LogoutLink className="px-3">Log out</LogoutLink>
            </div>
        </div>
      ) : (
        <div className="flex flex-grow justify-center items-center h-[calc(100vh-110px)] text-white">
            This page is protected, please <LoginLink> - Login -</LoginLink> to view it
        </div>
      );
}