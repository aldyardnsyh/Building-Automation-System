export interface WWTPSlave {
  flow: number;
  pressure: number;
  ph: number;
  pump_status: number;
  valve_status: number;
}

export interface CleanWaterSlave {
  flow: number;
  pressure: number;
  dist_status: number;
}

export interface FireSystemSlave {
  temp: number;
  smoke: number;
  status: number;
}

export interface BASData {
  wwtp: WWTPSlave;
  clean_water: CleanWaterSlave;
  fire_system: FireSystemSlave;
  timestamp: string;
}