/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { DateTimeEntity } from "./datetime.entity";
import { VaiTro } from "./enums/vai-tro";

@Entity("NGUOIDUNG")
export class NguoiDung extends DateTimeEntity {
  @PrimaryGeneratedColumn("uuid")
  maNguoiDung!: string;

  @Column({ type: "varchar", nullable: true })
  avatar!: string;

  @Column({
    type: "varchar",
  })
  hoTen!: string;

  @Column({ type: "varchar", unique: true })
  email!: string;

  @Column({ type: "varchar" })
  soDienThoai!: string;

  @Column({ type: "boolean", default: false })
  daXacThuc!: boolean;

  @Column({ type: "varchar", nullable: true })
  maXacThuc!: string | null;

  @Column({ type: "varchar" })
  matKhau!: string;

  @Column({ type: "boolean", default: false })
  taiKhoanGoogle!: boolean;

  @Column({
    type: "enum",
    enum: VaiTro,
    default: VaiTro.NGUOI_THUE,
  })
  vaiTro!: VaiTro;

  @Column({ type: "decimal", default: 0 })
  soDuTaiKhoan!: number;
}
