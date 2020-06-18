网元数据结构：

      [
        {
          ne_name: "Setup1",
          ip: "127.0.0.1",
          owner: "owner1",
          type: "type1",
          property1: "property1"
        },
        {
          ne_name: "Setup2",
          ip: "127.0.0.2",
          owner: "owner2",
          type: "type2",
          property1: "property2"
        },
        {
          ne_name: "Setup3",
          ip: "127.0.0.3",
          owner: "owner3",
          type: "type3",
          property1: "property3"
        }
      ]

网元操作的数据结构：

    [
        {
          operation: "NEPorv",
          loop: 1,
          trafficmonitor: true,
        },
        {
          operation: "WarmReset",
          loop: 1,
          trafficmonitor: true,
        },
        {
          operation: "ColdReset",
          loop: 1,
          trafficmonitor: true,
        },
        {
          operation: "ColdForce",
          loop: 1,
          trafficmonitor: true,
        },
        {
          operation: "DBRestored",
          loop: 1,
          trafficmonitor: true,
        },
        {
          operation: "Upgrade",
          loop: 1,
          trafficmonitor: true,
        },
        {
          operation: "Power",
          loop: 1,
          trafficmonitor: true,
        }
      ]