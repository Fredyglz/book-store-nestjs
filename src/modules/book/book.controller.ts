import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../role/decorators/role.decorator';
import { RoleType } from '../role/roletype.enum';
import { BookService } from './book.service';
import { ReadBookDto, UpdateBookDto } from './dtos';
import { RoleGuard } from '../role/guards/role.guard';
import { CreateBookDto } from './dtos/create-book.dto';
import { GetUser } from '../auth/user.decorator';

@Controller('book')
export class BookController {
  constructor(private readonly _bookService: BookService) {}

  @Get(':bookId')
  getBook(@Param('bookId', ParseIntPipe) bookId: number): Promise<ReadBookDto> {
    return this._bookService.get(bookId);
  }

  @Get('author/:authorId')
  getBooksByAuthor(
    @Param('authorId', ParseIntPipe) authorId: number,
  ): Promise<ReadBookDto[]> {
    return this._bookService.getBooksByAuthor(authorId);
  }

  @Get()
  getBooks(): Promise<ReadBookDto[]> {
    return this._bookService.getAll();
  }

  @Post()
  @Roles(RoleType.AUTHOR)
  @UseGuards(AuthGuard(), RoleGuard)
  createBook(@Body() book: Partial<CreateBookDto>): Promise<ReadBookDto> {
    return this._bookService.create(book);
  }

  @Roles(RoleType.AUTHOR)
  @UseGuards(AuthGuard(), RoleGuard)
  @Post()
  createBookByAuthor(
    @Body() book: Partial<CreateBookDto>,
    @GetUser('id') authorId: number,
  ): Promise<ReadBookDto> {
    return this._bookService.createByAuthor(book, authorId);
  }

  @Patch(':id')
  updateBook(
    @Param('id', ParseIntPipe) bookId: number,
    @Body() book: Partial<UpdateBookDto>,
    @GetUser('id') authorId: number,
  ): Promise<ReadBookDto> {
    return this._bookService.update(book, bookId, authorId);
  }

  @Delete(':id')
  deleteBook(@Param('id', ParseIntPipe) bookId: number): Promise<void> {
    return this._bookService.delete(bookId);
  }
}
