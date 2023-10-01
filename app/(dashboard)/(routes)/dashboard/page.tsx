
import { Card, Group } from "@mantine/core";



const InfoCard: React.FC<{
  title: string;
  index: number;
  desc: string;
  href: string;
}> = ({ title, href, index, desc }) => {

  return (
    <Card style={{
      borderRadius: '8px',
      fontSize: '14px',
      lineHeight: '22px',
      padding: '16px 19px',
      minWidth: '220px',
      flex: 1,
    }}>
      <div
        style={{
          display: 'flex',
          gap: '4px',
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            lineHeight: '22px',
            backgroundSize: '100%',
            textAlign: 'center',
            padding: '8px 16px 16px 12px',
            color: '#FFF',
            fontWeight: 'bold',
            backgroundImage:
              "url('https://gw.alipayobjects.com/zos/bmw-prod/daaf8d50-8e6d-4251-905d-676a24ddfa12.svg')",
          }}
        >
          {index}
        </div>
        <div
          style={{
            fontSize: '16px',
            paddingBottom: 8,
          }}
        >
          {title}
        </div>
      </div>
      <div
        style={{
          fontSize: '14px',
          textAlign: 'justify',
          lineHeight: '22px',
          marginBottom: 8,
        }}
      >
        {desc}
      </div>
      <a href={href} target="_self" rel="noreferrer">
        Go {'>>'}
      </a>
    </Card>
  );
};

const DashboardPage = () => {
  return (
    <> 
      <Card>
        <Group justify="space-between" h="100%">
          <InfoCard
            index={1}
            href="/tokensniffer"
            title="Token Sniffer"
            desc="Our app sources live data from Eth Alchemy and displays the realtime tokens, as and when created, paired, pooled, launched,locked"
          /> 
          <InfoCard
            index={2}
            title="Pattern Sniper"
            href="/patternsniper"
            desc="Pattern Sniper is a unique type of Token sniper applicable and usable with all state of tokens, the documents has more info on this"
          />
          <InfoCard
            index={3}
            title="Auto Trader"
            href="/autotrader"
            desc="Auto Trader is a unique sniper that snipes launches, takes profit on given levels, with take profit and stoploss and trailing stoploss features"
          />
        </Group>
      </Card>


    </>
  );
}


export default DashboardPage;