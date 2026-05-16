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
import { NguoiDung } from "./nguoi-dung.entity";
import { DateTimeEntity } from "./datetime.entity";

@Entity("YEUCAURUTTIEN")
export class YeuCauRutTien extends DateTimeEntity {
    @PrimaryGeneratedColumn("uuid")
    maYeuCau!: string;

    @ManyToOne(() => NguoiDung)
    @JoinColumn({ name: "maNguoiDung" })
    maNguoiDung!: NguoiDung;

    @Column({ type: "timestamp" })
    thoiGianRut!: Date;

    @Column({ type: "varchar" })
    maGiaoDich!: string;

    @Column({ type: "varchar", nullable: true })
    moTa?: string;

    @Column({ type: "varchar" })
    trangThai!: string;

    @Column({ type: "decimal" })
    soTien!: number;

    @Column({ type: "varchar" })
    tenNganHang!: string;

    @Column({ type: "varchar" })
    soTaiKhoan!: string;
}
