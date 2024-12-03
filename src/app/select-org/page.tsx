import { OrganizationList } from "@clerk/nextjs";

export default function SelectOrganizationPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">Select an Organization</h1>
      <OrganizationList 
        hidePersonal
        afterSelectOrganizationUrl="/admin/dashboard"
        afterCreateOrganizationUrl="/admin/dashboard"
      />
    </div>
  );
}

