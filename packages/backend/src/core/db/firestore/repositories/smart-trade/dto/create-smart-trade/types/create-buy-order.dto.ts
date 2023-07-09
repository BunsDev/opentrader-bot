import { OmitType } from "@nestjs/swagger";
import { IsDefined, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { OrderStatusEnum } from "src/core/db/types/common/enums/order-status.enum";
import { SmartBuyOrderEntity } from "src/core/db/types/entities/smart-trade/orders/buy/buy-order.entity";

export class CreateSmartTradeBuyOrderDto extends OmitType(SmartBuyOrderEntity, [
    'exchangeOrderId',
    'clientOrderId',
    'side',
    'quantity',
    'status',
    'fee',
    'createdAt'
  ] as const) {
    @IsString()
    @IsOptional()
    clientOrderId?: string;

    @IsEnum(OrderStatusEnum)
    @IsOptional()
    status?: OrderStatusEnum;

    @IsNumber()
    @IsDefined()
    price: number;
  }