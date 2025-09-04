import {
  PageContainer,
  PageContent,
  PageHeader,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderTitle,
} from "@/components/ui/page-container";

import SubscriptionPlan from "./_components/subscription-plan";

const SubscriptionPage = () => (
  <PageContainer>
    <PageHeader>
      <PageHeaderContent>
        <PageHeaderTitle>Assinatura</PageHeaderTitle>
        <PageHeaderDescription>
          Gerencie os planos de assinatura disponíveis para os usuários
        </PageHeaderDescription>
      </PageHeaderContent>
    </PageHeader>
    <PageContent>
      <SubscriptionPlan active={false} />
    </PageContent>
  </PageContainer>
);

export default SubscriptionPage;
