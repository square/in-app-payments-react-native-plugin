import { TurboModuleRegistry, type TurboModule } from 'react-native';

export interface Spec extends TurboModule {
  setSquareApplicationId(applicationId: string): void;
  getSquareApplicationId(): string | null;
}

export default TurboModuleRegistry.getEnforcing<Spec>('SQIPCore');
