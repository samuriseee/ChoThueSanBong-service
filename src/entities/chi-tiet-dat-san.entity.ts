/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { DatSan } from "./dat-san.entity";
import { SanBong } from "./san-bong.entity";
import { LoaiHinhDat } from "./loai-hinh-dat.entity";
import { NguoiDung } from "./nguoi-dung.entity";
import { DateTimeEntity } from "./datetime.entity";
import { SanBongChiTiet } from "./san-bong-chi-tiet.entity";

@Entity("CHITIETDATSAN")
export class ChiTietDatSan extends DateTimeEntity {
  @PrimaryGeneratedColumn("uuid")
  maChiTietDatSan!: string;

  @ManyToOne(() => DatSan)
  @JoinColumn({ name: "maDatSan" })
  maDatSan!: DatSan;

  @ManyToOne(() => SanBongChiTiet)
  @JoinColumn({ name: "maSanChiTiet" })
  maSanChiTiet!: SanBongChiTiet;

  @ManyToOne(() => NguoiDung)
  @JoinColumn({ name: "nguoiThue" })
  nguoiThue!: NguoiDung;

  @ManyToOne(() => LoaiHinhDat)
  @JoinColumn({ name: "maLoaiDat" })
  maLoaiDat!: LoaiHinhDat;

  @Column({ type: "varchar" })
  gioBatDau!: string;

  @Column({ type: "varchar" })
  gioKetThuc!: string;

  @Column({ type: "boolean", default: false })
  coVanDe!: boolean;

  @Column({ type: "varchar" })
  trangThaiDatSan!: string;

  @Column({ type: "decimal", default: 0 })
  soTien!: number;

  @Column({ type: "boolean", default: false })
  daGuiThongBao!: boolean;
}
