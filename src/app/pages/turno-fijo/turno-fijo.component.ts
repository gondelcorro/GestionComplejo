import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NuevoTurnoComponent} from './nuevo-turno/nuevo-turno.component';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {environment} from '../../../environments/environment';
import {ComplejoService} from '../../service/complejo.service';
import {ComplejoSharedService} from '../../service/complejo-shared.service';
import {MatTableDataSource} from '@angular/material/table';
import {TurnoFijoService} from '../../service/turno-fijo.service';
import {TurnoFijo} from '../../model/TurnoFijo';
import {EstadoReserva} from '../../model/estadoReserva';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-turno-fijo',
  templateUrl: './turno-fijo.component.html',
  styleUrls: ['./turno-fijo.component.css']
})
export class TurnoFijoComponent implements OnInit, AfterViewInit {

  listaTurnos: any = []; //Uso tipo any para poder instanciarlo como MatTableDataSource y usar el filtro, sino puede ser tipo lista  listaAlu: Alumno[] = [];
  displayedColumns: string[] = ['Estado', 'Jugador', 'Cancha', 'DiaSemana', 'HoraIni', 'HoraFin', 'Acciones'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  cantidad: number;
  turnoFijoSelected: TurnoFijo;

  constructor(private dialog: MatDialog, private complejoService: ComplejoService, private complejoSharedService: ComplejoSharedService,
              private turnoFijoService: TurnoFijoService, private snackbar: MatSnackBar) {

  }

  ngOnInit(): void {
    this.complejoService.obtenerComplejo(sessionStorage.getItem(environment.user)).subscribe(complejo => {
      this.complejoSharedService.setComplejo(complejo);
      this.listar(complejo.idComplejo);
    });
    //Para actualizar la lista cuando se crea desde el modal
    this.turnoFijoService.turnoFijoListCambio.subscribe(turnos => {
      this.listaTurnos = turnos;
    });
  }

  ngAfterViewInit() {
    this.listaTurnos.paginator = this.paginator;
    this.listaTurnos.sort = this.sort;
  }

  listar(idComplejo: number) {
    this.turnoFijoService.listarPorComplejo(idComplejo).subscribe(turnos => {
      this.listaTurnos = new MatTableDataSource(turnos);
      console.log(this.listaTurnos.data);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.listaTurnos.filter = filterValue.trim().toLowerCase();
    if (this.listaTurnos.paginator) {
      this.listaTurnos.paginator.firstPage();
    }
  }

  nuevoTurno() {
    this.dialog.open(NuevoTurnoComponent, {
      width: '650px',
      height: '440px',
      autoFocus: false
    });
  }

  diaNumberToString(diaSemana: number) {
    switch (diaSemana) {
      case 1:
        return 'Lunes';
        break;
      case 2:
        return 'Martes';
        break;
      case 3:
        return 'Miércoles';
        break;
      case 4:
        return 'Jueves';
        break;
      case 5:
        return 'Viernes';
        break;
      case 6:
        return 'Sábado';
        break;
      case 0:
        return 'Domingo';
        break;
    }
  }

  selectTurnoFijo(turno: TurnoFijo) {
    this.turnoFijoSelected = turno;
    this.turnoFijoService.turnoFijoCambio.next(turno);
  }

  public habilitarRenovacion(turno: TurnoFijo){
    if(turno.activo){
      let ultimoTurnoReservado = turno.reservas[turno.reservas.length - 1];
      let dia = Number(ultimoTurnoReservado.fecha.substring(0,2));
      let mes = Number(ultimoTurnoReservado.fecha.substring(3,5));
      let anio = Number(ultimoTurnoReservado.fecha.substring(6,10));
      let fechaUltimoTurnoReservado: Date = new Date(anio, mes-1, dia);
      fechaUltimoTurnoReservado.setDate(fechaUltimoTurnoReservado.getDate() - 10);
      let fechaActual = new Date();
      return ultimoTurnoReservado.estado != EstadoReserva.FINALIZADA ? fechaActual.getTime() > fechaUltimoTurnoReservado.getTime() : true;
    }else{
     return false;
    }
  }

  public renovar(turno: TurnoFijo){
    this.turnoFijoService.renovar(turno).subscribe(resp =>{
      if(resp.codigo == 99){
        this.snackbar.open("Renovación de turno fijo exitosa", "Info", {
          duration: 5000
        })
        this.turnoFijoService.listarPorComplejo(this.complejoSharedService.complejo.idComplejo).subscribe(turnos =>{
          this.turnoFijoService.turnoFijoListCambio.next(turnos);
        });
      }else{
        this.snackbar.open(resp.descripcion, 'Error', {
          duration: 5000
        });
      }
    });
  }

  public anular(turno: TurnoFijo){

  }

  public activar(turno: TurnoFijo){

  }
}
