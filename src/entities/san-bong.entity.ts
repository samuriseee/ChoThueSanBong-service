/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DateTimeEntity } from "./datetime.entity";
import { NguoiDung } from "./nguoi-dung.entity";
import { MediaSanBong } from "./media-san-bong.entity";

@Entity('SANBONG')
export class SanBong extends DateTimeEntity {
    @PrimaryGeneratedColumn("uuid")
    maSanBong!: string;

    @ManyToOne(() => NguoiDung)
    @JoinColumn({ name: 'chuSan' })
    chuSan!: NguoiDung;

    @Column({ type: "varchar" })
    tenSan!: string;

    @Column({ type: "varchar" })
    diaChi!: string;

    @Column({ type: "varchar" })
    quanHuyen!: string;

    @Column({ type: "varchar" })
    thanhPho!: string;

    @Column({ type: 'double precision', nullable: true })
    viDo!: number;

    @Column({ type: 'double precision', nullable: true })
    kinhDo!: number;

    @Column({ type: "varchar" })
    moTa!: string;

    @Column({ type: "varchar", nullable: true })
    hinhAnh?: string;

    @Column({ type: 'boolean', default: false })
    daDuyet!: boolean;

    @Column({ type: 'time' })
    gioMoCua!: string;

    @Column({ type: 'time' })
    gioDongCua!: string;

    @Column({ type: 'boolean', default: false })
    daBiDisable!: boolean;

    @OneToMany(() => MediaSanBong, (media) => media.sanBong, { cascade: true })
    media!: MediaSanBong[];
}